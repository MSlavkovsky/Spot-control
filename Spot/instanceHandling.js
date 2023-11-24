const puppeteer = require('puppeteer');
const variables = require('./variables.js');
const Timer = require('./timer.js');

class InstanceHandling {

  constructor(page, instance, instanceIndex) {
    this.instanceName = instance.name
    this.page = page
    this.isActive = false
    this.instanceTypes = []
    this.instanceJob = instance.action
    this.jobDone = false
    this.dbIsReady = false
    this.instanceIndex = instanceIndex
    this.instanceTypeIndex = 0
  }

  // Select instance to operate on
  async execute(instanceType, action, instanceTypeIndex) {
    // Searching instance by name
    this.isActive = true;
    this.instanceTypeIndex = instanceTypeIndex

    const element = await this.page.$(variables.clearAllBtn, { timeout: 3000 });

    if (element) {
      const filteredInstances = await this.page.evaluate(async (filters) => {
        const element = document.querySelector(filters).innerText;
        return element
      }, variables.filters)

      if (!filteredInstances.includes(this.instanceName)){
        await this.page.waitForSelector(variables.clearAllBtn);

        await this.page.evaluate(async (clearAllBtn) => {
          document.querySelector(clearAllBtn).click()
        }, variables.clearAllBtn)
  //      await this.page.click(variables.clearAllBtn);

        await this.page.waitForTimeout(2000);

        await this.page.type(variables.instanceSearchBar, this.instanceName, { delay: 0, timeout: 6000 });
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);
      }
    } else {
      await this.page.type(variables.instanceSearchBar, this.instanceName, { delay: 0, timeout: 6000 });
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);
    }

    await this.page.evaluate(async (variables, instanceName, instanceType) => {
      // Table with filtered isntances
      const table = elementBuilder(variables.instanceListTable)
      console.log(table)
      const tableArray = Array.from(table.children).filter(child => child.tagName.toLowerCase() === 'div');
      console.log(`Table has ${tableArray.length} rows`)

      var tableRow = 1
      var tableColumn = 2

      // Just for checking the result of filtering in the console
      for (let i = 0; tableArray.length > i; i++) {
        tableRow = i + 1
        const tablePathColumn = tablePathBuilder(tableRow, tableColumn)
        var elastigroupName = document.querySelector(tablePathColumn).innerText
        console.log(elastigroupName)
      }

      tableRow = 1
      console.log('instanceHandling - before for loop')
      // Selecting desired instance type (database / AIS-RCM / aaf) from table
      for (let i = 0; tableArray.length > i; i++) {
        console.log(`Loop ${i}`)
        tableRow = i + 1
        var tablePathColumn = tablePathBuilder(tableRow, tableColumn)
        var elastigroupName = document.querySelector(tablePathColumn).innerText
        var fullInstanceName = instanceName + instanceType

        console.log(elastigroupName)
        console.log(instanceName)
        console.log(instanceType)

        if (containsText(elastigroupName, fullInstanceName)) {
          var elementToClick = elementBuilder(tablePathBuilder(tableRow, tableColumn))
          elementToClick.click();
          break;
        }
      }

      function tablePathBuilder(tableRow, tableColumn) {
        var tablePathColumn = `${variables.instanceListTable} > div:nth-child(${tableRow}) > div:nth-child(${tableColumn})`
        return tablePathColumn
      }

      function elementBuilder(querySelector) {
        var element = document.querySelector(querySelector);
        return element
      }

      function containsText(innerText, text) {
        var containsText = innerText.includes(text)
        return containsText
      }
    }, variables, this.instanceName, instanceType);

    // Switch to instances tab in instance details
    await this.page.waitForSelector(variables.instanceDetailsOverviewTable, { timeout: 6000 })
    await this.page.waitForTimeout(2000);
    await this.page.evaluate((variables) => {
      const instanceMenu = document.querySelector(variables.instanceNavBar)
      const instanceMenuOption = Array.from(instanceMenu.children).filter(child => child.innerText === "Instances")
      instanceMenuOption[0].click()
    }, variables)

    await this.page.waitForSelector(variables.singleInstanceTable)
    await this.page.waitForTimeout(2000)

    var ipAddress = await this.page.evaluate( (singleInstanceTable) => {
    
      return elementBuilder(singleInstanceTable).rows[1].cells[8].innerText

      function elementBuilder(querySelector) {
        var element = document.querySelector(querySelector);
        return element
      }
    }, variables.singleInstanceTable)

    // Performing an action on selected instace
    var instanceStatus = await this.page.evaluate((variables, instanceName, action, instanceType) => {

      const actionsStates = {
        "Run": {
          "expectedInstanceState": "Paused",
          "action": "Resume"
        },
        "Stop": {
          "expectedInstanceState": "Running",
          "action": "Pause"
        }
      }

      console.log(action)
      console.log(elementBuilder(variables.singleInstanceTable).rows[1].cells[3].innerText)
      console.log(actionsStates.Run.expectedInstanceState)

      if (action === 'Run'){
        if (elementBuilder(variables.singleInstanceTable).rows[1].cells[3].innerText == actionsStates.Run.expectedInstanceState){
          executeAction(actionsStates.Run.action);
          backToInstanceList();
          if (instanceType === '-db') { return 'Resuming' } else return 'Running'
        }

        else if (elementBuilder(variables.singleInstanceTable).rows[1].cells[3].innerText === "Running") {
          console.log(`Instance: ${instanceName} is already \x1b[32mrunning\x1b[0m`)
          backToInstanceList();
          return 'already Running'
        }

        else if (elementBuilder(variables.singleInstanceTable).rows[1].cells[3].innerText === "Resuming") {
          console.log(`Instance: ${instanceName} is already \x1b[38;2;255;165;0mresuming\x1b[0m`)
          backToInstanceList();
          if (instanceType === '-db') { return 'Resuming' } else return 'Running'
        }

        else if (elementBuilder(variables.singleInstanceTable).rows[1].cells[3].innerText === "Pausing") {
          console.log(`Instance: ${instanceName} is \x1b[31mpausing\x1b[0m right now, skipping`)
          backToInstanceList();
          return 'Pausing currently'
        }
      }

      // Check if the selected instance is Paused

      if (action === 'Stop') {
        if (elementBuilder(variables.singleInstanceTable).rows[1].cells[3].innerText == actionsStates.Stop.expectedInstanceState
        || elementBuilder(variables.singleInstanceTable).rows[1].cells[3].innerText === "Pausing") {
          executeAction(actionsStates.Stop.action);
          backToInstanceList();
          return 'Paused'
        }

        else if (elementBuilder(variables.singleInstanceTable).rows[1].cells[3].innerText === "Paused") {
          console.log(`Instance: ${instanceName} is already \x1b[31mpaused\x1b[0m`)
          backToInstanceList();
          return 'already Paused'
        }

        else if (elementBuilder(variables.singleInstanceTable).rows[1].cells[3].innerText === "Resuming") {
          console.log(`Instance: ${instanceName} is \x1b[38;2;255;165;0mresuming\x1b[0m, skipping`)
          backToInstanceList();
          return 'Resuming currently'
        }
      }

      function executeAction(action) {
        // Select isntance - check checkbox
        const checkBoxCell = elementBuilder(variables.singleInstanceTable).rows[1].cells[0]
        const checkBoxCellArray = Array.from(checkBoxCell.children);
        const checkBox = checkBoxCellArray[0]
        checkBox.click()

        // Click Actions drop down
        elementBuilder(variables.actionsDropDown).click()

        setTimeout(() => {
          const dropDownMenuOptions = Array.from(elementBuilderArray(variables.dropDownMenu, 1).children).filter(child => child.tagName.toLowerCase() === 'md-menu-item')
          console.log(dropDownMenuOptions.length)

          for (let i = 0; dropDownMenuOptions.length > i; i++) {
            const dropDownMenuOptionsButton = dropDownMenuOptions[i].children

            // Find and click resume / stop action in dropdown menu
            if (containsText(dropDownMenuOptionsButton[0].innerText, action)) {
              dropDownMenuOptionsButton[0].click()
              console.log(dropDownMenuOptionsButton[0].innerText)
              break
            }
          }
          console.log(`Instance job performed: ${action} the instance: ${instanceName}`)

          setTimeout(function () {
            if (variables.resumeStatefulInstancesWarning) {
              console.log("Warning window opened")
              elementBuilder(variables.confirm_Btn).click()
              console.log(elementBuilder(variables.confirm_Btn).innerText)
            }
          }, 1000);

        }, 1000)

      }

      function backToInstanceList() {
        setTimeout(() => {
          console.log("Back to instances")
          // Returning back to instance list
          elementBuilder(variables.backButton).click()
        }, 3000);
      }

      function elementBuilder(querySelector) {
        var element = document.querySelector(querySelector);
        return element
      }

      function elementBuilderArray(querySelector, index) {
        var element = document.querySelectorAll(querySelector);
        return element[index]
      }

      function containsText(innerText, text) {
        var containsText = innerText.includes(text)
        return containsText
      }

    }, variables, this.instanceName, action, instanceType)

    await this.page.waitForSelector(variables.instanceListTable, { timeout: 60000 })
    await this.page.waitForTimeout(2000);
    this.updateInstanceStatus(instanceType, instanceStatus, ipAddress);

    // If Instance is -db and is starting
    if (instanceStatus === 'Resuming') {
      const timer = new Timer()

      const constantObject = {
        instanceStatus: instanceStatus
      };
      const context = this;

      const proxiedConstant = new Proxy(constantObject, {
        set: function (target, property, value) {
          if (property === "instanceStatus") {
            if (value instanceof Promise) {
              value.then((resolvedValue) => {
                console.log(`${context.instanceIndex + 1}.${context.instanceTypeIndex + 1} - Instance \x1b[33m${context.instanceName}${instanceType}\x1b[0m is done ${target.instanceStatus} and now is \x1b[32m${resolvedValue}\x1b[0m`);
                target[property] = resolvedValue;
                context.updateInstanceStatus(instanceType, proxiedConstant.instanceStatus);
              }).catch((error) => {
                console.error("Error occurred while resolving the Promise:", error);
              });
            } else {
              console.log(`${context.instanceIndex + 1}.${context.instanceTypeIndex + 1} - Instance \x1b[33m${context.instanceName}${instanceType}\x1b[0m is done ${target.instanceStatus} and now is \x1b[32m${value}\x1b[0m`);
              target[property] = value;
              context.updateInstanceStatus(instanceType, proxiedConstant.instanceStatus);
              context.dbIsReady = true
            }
            return true;
          }
          return Reflect.set(target, property, value);
        },
      });

      timer.execute(variables.dbWaitTime)
        .then((resolvedValue) => {
          proxiedConstant.instanceStatus = resolvedValue;
        })
        .catch((error) => {
          console.error("Error occurred while executing the timer:", error);
        });
    }

    this.isActive = false;
  }

  async updateInstanceStatus(instanceType, instanceStatus, ipAddress) {
    const instanceTypeIndex = this.instanceTypes.findIndex(obj => obj.type === instanceType)
    this.instanceTypes[instanceTypeIndex].status = instanceStatus
    this.instanceTypes[instanceTypeIndex].ipAddress = ipAddress
    
  }
}
module.exports = InstanceHandling;