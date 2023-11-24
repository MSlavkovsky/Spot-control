// Source data

// Login page
const spotPage = 'https://console.spotinst.com/spt/auth/signIn';
const signInSSO_Btn = '#spotinstConsoleApp > div > main > div > div > div > div > form > div:nth-child(3)';
const signIn_Btn = '.link-text.dark-hover.no-underline.sign-in.ng-binding';
const account = 'Martin.Slavkovsky@niceactimize.com';

const winAccount = '[id*="TemplateContainer"] > div.outer > div.template-section.main-section > div > div > div > div'
const accountOptions = '#tilesHolder'

// Main Page
const mainScreenDiagram = 'spt-overview-root > spt-overview-main > div > div > spt-dashboard-tab-main > div > spt-savings-potential > div > spt-expansion-list > div > spt-savings-potential-card:nth-child(1) > mat-card';

// Account menu
const headerShadowRoot = '#single-spa-application\\:header > spt-header-root';
const accountMenu_Btn = 'spt-header > div > div > div:nth-child(2) > div > spt-header-account-menu > spt-header-menu-opener > div';
const accountMenuOptions = '#mat-menu-panel-1 > div > div > div > spt-virtual-scroll-list > cdk-virtual-scroll-viewport > div.cdk-virtual-scroll-content-wrapper'
const awsAccount = "AWS-ACT-RND-AML-DEV (986951817102)"

// Navigation bar
const navBarShadowRoot = '#single-spa-application\\:navbar > spt-navbar-app-root';
const navBar_Btn = 'spt-header > div > div > div:nth-child(1) > div:nth-child(1) > mat-icon';
const navBarOption_Btn = '[id^="cdk-overlay-"] > navbar-product-list > div > spt-navbar-menu-item:nth-child(2) > a';

// Main Page - Elastigroups
const runningSpotNumber = '#spotinstConsoleApp > div > main > div > section > div.dashboard.m-top-xl.ng-scope.flex > md-content > overview > div > div.content.overview-boxes.m-top-m.layout-align-center-center.layout-column.flex > div.m-bottom-l.layout-fill.ng-scope.layout-align-center-center.layout-row.flex > point-value-box:nth-child(1) > div';
const instanceSearchBar = '#spotinstConsoleApp > div > main > div > section > div.aws.ng-scope.layout-row.flex > div > div > div > div.layout-column.flex > div.layout-align-end-end.layout-row > search-bar > div.layout-column > div.input-wrapper.layout-fill.layout-align-start-center.layout-row > input';
const clearAllBtn = '#spotinstConsoleApp > div > main > div > section > div.aws.ng-scope.layout-row.flex > div > div > div > div.layout-column.flex > div.layout-align-end-end.layout-row > search-bar > div.layout-column > div.filters.m-bottom-s.layout-align-start-start.layout-row > div > div.clickable.clear-all.m-x-o.m-right-s.p-x-0.layout-align-center-center.layout-row';
const filters = '#spotinstConsoleApp > div > main > div > section > div.aws.ng-scope.layout-row.flex > div > div > div > div.layout-column.flex > div.layout-align-end-end.layout-row > search-bar > div.layout-column > div.filters.m-bottom-s.layout-align-start-start.layout-row > md-chips'
const instanceListTable = '#spotinstConsoleApp > div > main > div > section > div.aws.ng-scope.layout-row.flex > div > div > div > div.layout-column.flex > md-content > md-content > resizable-table > div > div.ag-theme-material.ng-scope.flex > div > div.ag-root-wrapper-body.ag-layout-normal > div > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div';
const instanceListTable1 = '#spotinstConsoleApp > div > main > div > section > div.aws.ng-scope.layout-row.flex > div > div > div > div.layout-column.flex > md-content > md-content > resizable-table > div > div.ag-theme-material.ng-scope.flex > div > div.ag-root-wrapper-body.ag-layout-normal > div > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div:nth-child(1) > div:nth-child(3)';

// Side menu -> groups
const sideMenuGroups_Btn = 'div.main-view > spt-navbar-container > div > navbar-item-list > div > div > div > spt-navbar-menu-item:nth-child(2) > a';

// Instance details
const instanceDetailsOverviewTable = 'div > section.m-bottom-m.ng-scope.layout-column > group-overview-details > div';
const instanceNavBar = '#spotinstConsoleApp > div > main > div > section > div.aws.ng-scope.layout-row.flex > div > div > div > md-tabs > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper';
const singleInstanceTable = 'div > tab-lazy-load > div > ng-transclude > section.ng-scope.layout-row > group-stateful-instance-table > div > div > div.layout-column.flex > div > md-data-table-container > table';
const actionsDropDown = 'div > tab-lazy-load > div > ng-transclude > section.ng-scope.layout-row > group-stateful-instance-table > div > div > div.layout-column.flex > div > md-menu-bar > md-menu > button';
const dropDownMenu = '[id^="menu_container_"] > md-menu-content';
const backButton = '#spotinstConsoleApp > div > main > div > section > div.aws.ng-scope.layout-row.flex > div > div > div > header > div > div.layout-align-start-center.layout-row > a > md-icon';

// Pop up window
const resumeStatefulInstancesWarning = '[id^="dialogContent_"] > form > md-toolbar > div'
const confirm_Btn = '[id^="dialogContent_"] > form > md-dialog-actions > button.md-primary.md-raised.md-button.md-ink-ripple'
const dbWaitTime = 5

module.exports = {
    spotPage,
    signInSSO_Btn,
    signIn_Btn,
    account,
    winAccount,
    accountOptions,
    mainScreenDiagram,
    headerShadowRoot,
    accountMenu_Btn,
    accountMenuOptions,
    awsAccount,
    navBarShadowRoot,
    navBar_Btn,
    navBarOption_Btn,
    runningSpotNumber,
    instanceSearchBar,
    clearAllBtn,
    filters,
    instanceListTable,
    sideMenuGroups_Btn,
    instanceDetailsOverviewTable,
    instanceNavBar,
    singleInstanceTable,
    actionsDropDown,
    dropDownMenu,
    backButton,
    resumeStatefulInstancesWarning,
    confirm_Btn,
    instanceListTable1,
    dbWaitTime
}