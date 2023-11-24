// http://127.0.0.1:9222/json/version

/* vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv UPDATE EVERY TIME CHROME IS OPENED vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv */
const webSocketDebuggerUrl = {
  "webSocketDebuggerUrl": "ws://127.0.0.1:9222/devtools/browser/0ef551ad-f02d-46b3-9957-998f4af12cee"
};
/* vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv UPDATE EVERY TIME CHROME IS OPENED vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv */

/* 
example:    {
              "name": "cdddslpipelinescddondemandaws-sqlserver2019ee-mslavkovsky_dart_reports_win-351-martin.slavkovsky@niceactimize.com",
              "type": ["DB"] or ["DB", "RCM"] or ["DB", "RCM", "AAF"] ... ,
              "action" : "Run" or "Stop"
            }
*/

const instances = [
  {
    "name": "cdddslpipelinescddondemandaws-sqlserver2019ee-dart-lin-mssql-600-martin.slavkovsky@niceactimize.com",
    "type": ["RCM", "DB"],
    "action": "Stop"
  },
  {
    "name": "cdddslpipelinescddondemandaws-oracle19-dart-lin-oracle-602-martin.slavkovsky@niceactimize.com",
    "type": ["DB", "RCM"],
    "action": "Stop"
  },
  {
    "name": "cdddslpipelinescddondemandaws-sqlserver2019ee-dart-win-mssql-538-martin.slavkovsky@niceactimize.com",
    "type": ["DB", "RCM"],
    "action": "Stop"
  },
  {
    "name": "cdddslpipelinescddondemandaws-sqlserver2019ee-dart-lin-mssql2-609-martin.slavkovsky@niceactimize.com",
    "type": ["RCM", "DB"],
    "action": "Stop"
  },
  {
    "name": "https://nice-actimize.atlassian.net/wiki/spaces/AML/pages/3937005/CDD+AWS+Linux+Oracle+19",
    "type": ["DB", "RCM"],
    "action": ""
  }
]

const actimizeAccount = 'Martin.Slavkovsky@niceactimize.com'

function convertInstanceObject() {

  instances.sort((a, b) => ["Run", "Stop", ""].indexOf(a.action) - ["Run", "Stop", ""].indexOf(b.action));

  const instanceTypeOrder = {
    "Run": ["DB", "RCM", "AAF"],
    "Stop": ["AAF", "RCM", "DB"]
  }

  instances.forEach((instance) => {
    instance.type.sort((a, b) => sortByOrder(instance, a, b));
  });

  function sortByOrder(instance, a, b) {
    switch (instance.action) {
      case "Run":
        return instanceTypeOrder.Run.indexOf(a) - instanceTypeOrder.Run.indexOf(b);

      case "Stop":
        return instanceTypeOrder.Stop.indexOf(a) - instanceTypeOrder.Stop.indexOf(b);
    }
  }

  for (const instance of instances) {
    instance.type = instance.type.map(item => {
      return item.replace("DB", "-db").replace("RCM", "-ais_rcm").replace("AAF", "-aaf");
    });
  }

}

convertInstanceObject()

const wsChromeEndpointUrl = webSocketDebuggerUrl.webSocketDebuggerUrl;
const confluencePage = "https://www.google.sk/";

module.exports = {
  wsChromeEndpointUrl,
  confluencePage,
  instances
}