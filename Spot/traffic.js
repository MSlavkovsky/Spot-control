const puppeteer = require('puppeteer');
const variables = require('./variables.js');
const InstanceHandling = require('./instanceHandling.js');

class Traffic {

    constructor(page, envInstances) {
        this.execute(page, envInstances)
        this.instanceArray
    }

    async execute(page, envInstances) {
        var instanceArray1 = []
        var instanceIndex = 0

        for (const instance of envInstances) {
            if (instance.action !== '') {
                const envInstance1 = new InstanceHandling(page, instance, instanceIndex);

                for (let i = 0; instance.type.length > i; i++){
                    const envInstanceType = {
                        "type": instance.type[i],
                        "status": "unknown",
                        "ipAddress": ""
                    }
                    envInstance1.instanceTypes.push(envInstanceType)
                }

                instanceArray1.push(envInstance1);
                console.log(instance);
                instanceIndex++
            }
        }

        console.log()

        // Instance state change triger
        const context = this;
        this.instanceArray = instanceArray1.map((obj, index) => {
            return new Proxy(obj, {
                set: function (target, property, value) {
                    if (property == 'isActive' || property === 'dbIsReady') {
                        if ((property == 'isActive' && value === false) && target[property] !== value) {
                            const instance = context.instanceArray[index].instanceName
                            const instanceType = context.instanceArray[index].instanceTypes[context.instanceArray[index].instanceTypeIndex].type
                            const instanceStatus = context.instanceArray[index].instanceTypes[context.instanceArray[index].instanceTypeIndex].status
                            const instanceTypeIndex = context.instanceArray[index].instanceTypes.findIndex(obj => obj.type === instanceType)

                            // Update the property value
                            target[property] = value;

                            // Property value has changed
                            if (instanceStatus === 'Running') {
                                console.log(`${index + 1}.${instanceTypeIndex + 1} - Instance \x1b[33m${instance}${instanceType}\x1b[0m is now \x1b[32m${instanceStatus}\x1b[0m`)
                            } else if (instanceStatus === 'Paused') {
                                console.log(`${index + 1}.${instanceTypeIndex + 1} - Instance \x1b[33m${instance}${instanceType}\x1b[0m is now \x1b[31m${instanceStatus}\x1b[0m`)
                            } else if (instanceStatus === 'Resuming') {
                                console.log(`${index + 1}.${instanceTypeIndex + 1} - Instance \x1b[33m${instance}${instanceType}\x1b[0m is now \x1b[38;2;255;165;0m${instanceStatus}\x1b[0m`)
                            } else if (instanceStatus === 'already Running') {
                                context.instanceArray[index].instanceTypes[context.instanceArray[index].instanceTypeIndex].status = 'Running'
                                console.log(`${index + 1}.${instanceTypeIndex + 1} - Instance \x1b[33m${instance}${instanceType}\x1b[0m is \x1b[32m${instanceStatus}\x1b[0m`)
                            } else if (instanceStatus === 'already Paused') {
                                context.instanceArray[index].instanceTypes[context.instanceArray[index].instanceTypeIndex].status = 'Paused'
                                console.log(`${index + 1}.${instanceTypeIndex + 1} - Instance \x1b[33m${instance}${instanceType}\x1b[0m is \x1b[31m${instanceStatus}\x1b[0m`)
                            } else if (instanceStatus === 'Pausing currently') {
                                context.instanceArray[index].instanceTypes[context.instanceArray[index].instanceTypeIndex].status = 'Skipping'
                                console.log(`${index + 1}.${instanceTypeIndex + 1} - Instance \x1b[33m${instance}${instanceType}\x1b[0m is \x1b[38;2;255;165;0m${instanceStatus}\x1b[0m, canceling execution`)
                            } else if (instanceStatus === 'Resuming currently') {
                                context.instanceArray[index].instanceTypes[context.instanceArray[index].instanceTypeIndex].status = 'Skipping'
                                console.log(`${index + 1}.${instanceTypeIndex + 1} - Instance \x1b[33m${instance}${instanceType}\x1b[0m is \x1b[38;2;255;165;0m${instanceStatus}\x1b[0m, canceling execution`)
                            }
                            // Call your actionTrigger function here
                            context.actionTrigger();
                            return true;

                        } else if ((property === 'dbIsReady' && value === true) && target[property] !== value) {

                            // Update the property value
                            target[property] = value;

                            // Call your actionTrigger function here
                            context.actionTrigger();
                            return true;
                        }
                    }
                    return Reflect.set(target, property, value);
                },
            });
        })

        this.actionTrigger()
    }

    // Logic for running / stopping instances
    async actionTrigger() {
        Loop:
        for (const instance of this.instanceArray) {
            if (instance.instanceJob === '') continue Loop

            const instanceIndex = this.instanceArray.findIndex(obj => obj.instanceName === instance.instanceName)
            var allowAction = true;

            for (const instance1 of this.instanceArray) {
                allowAction &&= !instance1.isActive
            }

            Loop1:
            for (const instanceType of instance.instanceTypes) {
                const instanceTypeIndex = instance.instanceTypes.findIndex(obj => obj.type === instanceType.type)

                if (typeof instanceType.type === 'undefined') continue Loop1

                if (instance.instanceJob === 'Run') {
                    if (instance.instanceTypes[0].status === 'Resuming' || instance.instanceTypes[0].status === 'Skipping') continue Loop
                    if (allowAction && (instanceType.status !== 'Running' && instanceType.status !== 'Resuming')) {

                        console.log(`\n${instanceIndex + 1}.${instanceTypeIndex + 1} - Executing action: \x1b[32m${instance.instanceJob}\x1b[0m Instance \x1b[33m${instance.instanceName}${instanceType.type}\x1b[0m`)
                        instance.execute(instanceType.type, instance.instanceJob, instanceTypeIndex)
                        break Loop
                    }
                }

                if (instance.instanceJob === 'Stop') {
                    for (const instanceType1 of instance.instanceTypes) {
                        if (instanceType1 === 'Skipping') continue Loop
                    }

                    if (allowAction && instanceType.status !== 'Paused') {

                        console.log(`\n${instanceIndex + 1}.${instanceTypeIndex + 1} - Executing action: \x1b[31m${instance.instanceJob}\x1b[0m Instance \x1b[33m${instance.instanceName}${instanceType.type}\x1b[0m`)
                        instance.execute(instanceType.type, instance.instanceJob, instanceTypeIndex)
                        break Loop
                    }
                }
            }
        }

        if (true) {
            console.log()
            for (const instance of this.instanceArray) {
                const instanceIndex = this.instanceArray.findIndex(obj => obj.instanceName === instance.instanceName)
    
                for (const instanceType of instance.instanceTypes) {
                    const instanceTypeIndex = instance.instanceTypes.findIndex(obj => obj.type === instanceType.type)
    
                    console.log(`${instanceIndex + 1}.${instanceTypeIndex + 1} - ${instance.instanceName}${instanceType.type} - ${instanceType.ipAddress}`)
                }
                console.log()
            }
        }

    }
}
module.exports = Traffic;