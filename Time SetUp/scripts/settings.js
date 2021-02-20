var storage = new LocalStorage();
var ignorlist = [];
var restrictionList = [];
var notifyList = [];
var blockBtnList = ['btnSettings', 'btnLimits', 'btnNtificationSet', 'btnAboutUs'];
var blockList = ['blockSetting', 'blockLimits', 'blockNotification', 'blockAboutUs'];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnSettings').addEventListener('click', function () {
        setBlockEvent('btnSettings', 'blockSetting');
    });
    document.getElementById('btnLimits').addEventListener('click', function () {
        setBlockEvent('btnLimits', 'blockLimits');
    });
    document.getElementById('btnNtificationSet').addEventListener('click', function () {
        setBlockEvent('btnNtificationSet', 'blockNotification');
    });
    document.getElementById('btnAboutUs').addEventListener('click', function () {
        setBlockEvent('btnAboutUs', 'blockAboutUs');
        loadVersion();
    });
    document.getElementById('clearAllData').addEventListener('click', function () {
        clearAllData();
    });
    document.getElementById('exportToCsv').addEventListener('click', function () {
        exportToCSV();
    });
    document.getElementById('exportToDoc').addEventListener('click', function () {
        exportToDoc();
    });
    document.getElementById('backup').addEventListener('click', function () {
        backup();
    });
    document.getElementById('restore').addEventListener('click', function () {
        restoreDataClick();
    });
    document.getElementById('file-input-backup').addEventListener('change', function (e) {
        restore(e);
    });
    document.getElementById('addignorDomainBtn').addEventListener('click', function () {
        addNewSiteClickHandler('addignorList', null, actionAddBlackSiteToList, 'notifyForignorlist');
    });
    document.getElementById('addRestrictionSiteBtn').addEventListener('click', function () {
        addNewSiteClickHandler('addRestrictionSiteLbl', 'addRestrictionTimeLbl', actionAddRectrictionToList, 'notifyForRestrictionList');
    });
    document.getElementById('addNotifySiteBtn').addEventListener('click', function () {
        addNewSiteClickHandler('addNotifySiteLbl', 'addNotifyTimeLbl', actionAddNotifyToList, 'notifyForNotifyList');
    });
    // document.getElementById('viewTimeInBadge').addEventListener('change', function () {
    //     storage.saveValue(SETTINGS_VIEW_TIME_IN_BADGE, this.checked);
    // });
    document.getElementById('inactiveIntervalSet').addEventListener('change', function () {
        storage.saveValue(SETTINGS_INTERVAL_INACTIVITY, this.value);
    });
    document.getElementById('username').addEventListener('change', function () {
        chrome.storage.local.get('username', function () {
            var newusername = document.getElementById('username').value;
            chrome.storage.local.set({ 'username': newusername });

        })
    });
    document.getElementById('rangeToDays').addEventListener('change', function () {
        storage.saveValue(SETTINGS_INTERVAL_RANGE, this.value);
    });
    document.getElementById('grantPermissionForNotifications').addEventListener('click', function () {
        grantPermissionForNotifications();
    });

    $('.clockpicker').clockpicker();

    loadSettings();
});

function setBlockEvent(btnName, blockName) {
    blockBtnList.forEach(element => {
        if (element === btnName) {
            document.getElementById(btnName).classList.add('active');
        }
        else document.getElementById(element).classList.remove('active');
    });

    blockList.forEach(element => {
        if (element === blockName) {
            document.getElementById(blockName).hidden = false;
        } else document.getElementById(element).hidden = true;
    });
}

function loadSettings() {
    storage.getValue(SETTINGS_INTERVAL_INACTIVITY, function (item) {
        document.getElementById('inactiveIntervalSet').value = item;
    });
    storage.getValue(SETTINGS_INTERVAL_RANGE, function (item) {
        document.getElementById('rangeToDays').value = item;
    });
    // storage.getValue(SETTINGS_VIEW_TIME_IN_BADGE, function (item) {
    //     document.getElementById('viewTimeInBadge').checked = item;
    // });
    storage.getMemoryUse(STORAGE_TABS, function (integer) {
        document.getElementById('memoryUse').innerHTML = (integer / 1024).toFixed(2) + 'Kb';
    });
    storage.getValue(STORAGE_TABS, function (item) {
        let s = item;
    });
    storage.getValue(STORAGE_BLACK_LIST, function (items) {
        if (items !== undefined)
            ignorlist = items;
        else ignorlist = [];
        viewignorlist(items);
    });
    storage.getValue(STORAGE_RESTRICTION_LIST, function (items) {
        restrictionList = items;
        if (restrictionList === undefined)
            restrictionList = [];
        viewRestrictionList(items);
    });
    storage.getValue(STORAGE_NOTIFICATION_LIST, function (items) {
        notifyList = items;
        if (notifyList === undefined)
            notifyList = [];
        viewNotificationList(items);
    });
    storage.getValue(STORAGE_NOTIFICATION_MESSAGE, function (mess) {
        document.getElementById('notifyMessage').value = mess;
    });
}

function loadVersion() {
    var version = chrome.runtime.getManifest().version;
    document.getElementById('version').innerText = 'v' + version;
}

function viewignorlist(items) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addDomainToListBox(items[i]);
        }
    }
}


function grantPermissionForNetflix() {
    chrome.permissions.request({
        permissions: ['tabs'],
        origins: ["https://www.netflix.com/*"]
    }, function (granted) {
        // The callback argument will be true if the user granted the permissions.
        if (granted) {
            setUIForAnyPermissionForNetflix();
        }
    });
}

function grantPermissionForNotifications() {
    chrome.permissions.request({
        permissions: ["notifications"]
    }, function (granted) {
        // The callback argument will be true if the user granted the permissions.
        if (granted) {
            setUIForAnyPermissionForNotifications();
        }
    });
}

// function setUIForAnyPermissionForNetflix() {
//     document.getElementById('permissionSuccessedBlockForNetflix').hidden = false;
//     document.getElementById('permissionSuccessedBlockForNetflix').classList.add('inline-block');
//     document.getElementById('grantPermissionForNetflix').hidden = true;
// }

function setUIForAnyPermissionForNotifications() {
    document.getElementById('permissionSuccessedBlockForNotifications').hidden = false;
    document.getElementById('permissionSuccessedBlockForNotifications').classList.add('inline-block');
    document.getElementById('grantPermissionForNotifications').hidden = true;
}

function viewNotificationList(items) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addDomainToEditableListBox(items[i], 'notifyList', actionEditSite, deleteNotificationSite, updateItemFromNotifyList, updateNotificationList);
        }
    }
}

function viewRestrictionList(items) {
    if (items !== undefined) {
        for (var i = 0; i < items.length; i++) {
            addDomainToEditableListBox(items[i], 'restrictionsList', actionEditSite, deleteRestrictionSite, updateItemFromResctrictoinList, updateRestrictionList);
        }
    }
}
function exportToDoc() {
    storage.getValue(STORAGE_TABS, function (item) {
        toDoc(item);
    });
}

function exportToCSV() {
    storage.getValue(STORAGE_TABS, function (item) {
        toCsv(item);
    });
}

function backup() {
    storage.getValue(STORAGE_TABS, function (item) {
        let tabs = JSON.stringify(item);
        createFile(tabs, "application/json", 'Time_SetUp.json');
        viewNotify('notify-backup');
    });
}

function restoreDataClick() {
    document.getElementById('file-input-backup').click();
}

function restore(e) {
    let file = e.target.files[0];
    if (file.type === "application/json") {
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = readerEvent => {
            let content = readerEvent.target.result;
            let tabs = JSON.parse(content);
            chrome.extension.getBackgroundPage().tabs = tabs;
            storage.saveTabs(tabs, function () {
                storage.getMemoryUse(STORAGE_TABS, function (integer) {
                    document.getElementById('memoryUse').innerHTML = (integer / 1024).toFixed(2) + 'Kb';
                });
                viewNotify('notify-restore');

            });

        }
    } else {
        viewNotify('notify-restore-failed');
    }
}
function toDoc(tabsData) {
    var str = 'domain,date,time(sec)\r\n';
    for (var i = 0; i < tabsData.length; i++) {
        for (var y = 0; y < tabsData[i].days.length; y++) {
            var line = tabsData[i].url + ',' + tabsData[i].days[y].date + ',' + tabsData[i].days[y].summary;
            str += line + '\r\n';
        }
    }
    createFile(str, "text/doc", 'Time SetUp.doc');
}



function toCsv(tabsData) {
    var str = 'domain,date,time(sec)\r\n';
    for (var i = 0; i < tabsData.length; i++) {
        for (var y = 0; y < tabsData[i].days.length; y++) {
            var line = tabsData[i].url + ',' + tabsData[i].days[y].date + ',' + tabsData[i].days[y].summary;
            str += line + '\r\n';
        }
    }
    createFile(str, "text/csv", 'Time SetUp.csv');
}

function createFile(data, type, fileName) {
    var file = new Blob([data], { type: type });
    var downloadLink;
    downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.href = window.URL.createObjectURL(file);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function clearAllData() {
    var tabs = [];
    chrome.extension.getBackgroundPage().tabs = tabs;
    storage.saveTabs(tabs, allDataDeletedSuccess);
}

function allDataDeletedSuccess() {
    storage.getMemoryUse(STORAGE_TABS, function (integer) {
        document.getElementById('memoryUse').innerHTML = (integer / 1024).toFixed(2) + 'Kb';
    });
    viewNotify('notify-delete');
}

function viewNotify(elementName) {
    document.getElementById(elementName).hidden = false;
    setTimeout(function () { document.getElementById(elementName).hidden = true; }, 3000);
}

function actionAddRectrictionToList(newSite, newTime) {
    if (!isContainsRestrictionSite(newSite)) {
        var restriction = new Restriction(newSite, newTime);
        addDomainToEditableListBox(restriction, 'restrictionsList', actionEditSite, deleteRestrictionSite, updateItemFromResctrictoinList, updateRestrictionList);
        if (restrictionList === undefined)
            restrictionList = [];
        restrictionList.push(restriction);
        document.getElementById('addRestrictionSiteLbl').value = '';
        document.getElementById('addRestrictionTimeLbl').value = '';

        updateRestrictionList();

        return true;
    } else return false;
}

function actionAddBlackSiteToList(newSite) {
    if (!isContainsBlackSite(newSite)) {
        addDomainToListBox(newSite);
        if (ignorlist === undefined)
            ignorlist = [];
        ignorlist.push(newSite);
        document.getElementById('addignorList').value = '';

        updateignorlist();

        return true;
    } else return false;
}

function actionAddNotifyToList(newSite, newTime) {
    if (!isContainsNotificationSite(newSite)) {
        var notify = new Notification(newSite, newTime);
        addDomainToEditableListBox(notify, 'notifyList', actionEditSite, deleteNotificationSite, updateItemFromNotifyList, updateNotificationList);
        if (notifyList === undefined)
            notifyList = [];
        notifyList.push(notify);
        document.getElementById('addNotifySiteLbl').value = '';
        document.getElementById('addNotifyTimeLbl').value = '';

        updateNotificationList();

        return true;
    } else return false;
}

function addNewSiteClickHandler(lblName, timeName, actionCheck, blockNotification) {
    var newSite = document.getElementById(lblName).value;
    var newTime;
    if (timeName != null)
        newTime = document.getElementById(timeName).value;
    if (newSite !== '' && (newTime === undefined || (newTime !== undefined && newTime !== ''))) {
        if (!actionCheck(newSite, newTime))
            viewNotify(blockNotification);
    }
}

function addDomainToListBox(domain) {
    var li = document.createElement('li');
    li.innerText = domain;
    var del = document.createElement('img');
    del.height = 12;
    del.src = '/icons/delete.png';
    del.addEventListener('click', function (e) {
        deleteBlackSite(e);
    });
    document.getElementById('ignorlist').appendChild(li).appendChild(del);
}

function addDomainToEditableListBox(entity, elementId, actionEdit, actionDelete, actionUpdateTimeFromList, actionUpdateList) {
    var li = document.createElement('li');

    var domainLbl = document.createElement('input');
    domainLbl.type = 'text';
    domainLbl.classList.add('readonly-input', 'inline-block', 'element-item');
    domainLbl.value = entity.domain;
    domainLbl.readOnly = true;
    domainLbl.setAttribute('name', 'domain');

    var edit = document.createElement('img');
    edit.setAttribute('name', 'editCmd');
    edit.height = 14;
    edit.src = '/icons/edit.png';
    edit.addEventListener('click', function (e) {
        actionEdit(e, actionUpdateTimeFromList, actionUpdateList);
    });

    var del = document.createElement('img');
    del.height = 12;
    del.src = '/icons/delete.png';
    del.classList.add('margin-left-5');
    del.addEventListener('click', function (e) {
        actionDelete(e, actionUpdateTimeFromList, actionUpdateList);
    });

    var bloc = document.createElement('div');
    bloc.classList.add('clockpicker');
    bloc.setAttribute('data-placement', 'left');
    bloc.setAttribute('data-align', 'top');
    bloc.setAttribute('data-autoclose', 'true');
    var timeInput = document.createElement('input');
    timeInput.type = 'text';
    timeInput.classList.add('clock', 'clock-li-readonly');
    timeInput.setAttribute('readonly', true);
    timeInput.setAttribute('name', 'time');
    timeInput.value = convertShortSummaryTimeToString(entity.time);
    bloc.appendChild(timeInput);

    var hr = document.createElement('hr');
    var li = document.getElementById(elementId).appendChild(li);
    li.appendChild(domainLbl);
    li.appendChild(del);
    li.appendChild(edit);
    li.appendChild(bloc);
    li.appendChild(hr);
}

function deleteBlackSite(e) {
    var targetElement = e.path[1];
    ignorlist.splice(ignorlist.indexOf(targetElement.innerText), 1);
    document.getElementById('ignorlist').removeChild(targetElement);
    updateignorlist();
}

function deleteRestrictionSite(e) {
    var targetElement = e.path[1];
    var itemValue = targetElement.querySelector("[name='domain']").value;
    var item = restrictionList.find(x => x.domain == itemValue);
    restrictionList.splice(restrictionList.indexOf(item), 1);
    document.getElementById('restrictionsList').removeChild(targetElement);
    updateRestrictionList();
}

function deleteNotificationSite(e) {
    var targetElement = e.path[1];
    var itemValue = targetElement.querySelector("[name='domain']").value;
    var item = notifyList.find(x => x.domain == itemValue);
    notifyList.splice(notifyList.indexOf(item), 1);
    document.getElementById('notifyList').removeChild(targetElement);
    updateNotificationList();
}

function actionEditSite(e, actionUpdateTimeFromList, actionUpdateList) {
    var targetElement = e.path[1];
    var domainElement = targetElement.querySelector('[name="domain"]');
    var timeElement = targetElement.querySelector('[name="time"]');
    if (timeElement.classList.contains('clock-li-readonly')) {
        timeElement.classList.remove('clock-li-readonly');
        var hour = timeElement.value.split(':')[0].slice(0, 2);
        var min = timeElement.value.split(':')[1].slice(1, 3);
        timeElement.value = hour + ':' + min;
        var editCmd = targetElement.querySelector('[name="editCmd"]');
        editCmd.src = '/icons/success.png';
        $('.clockpicker').clockpicker();
    }
    else {
        var domain = domainElement.value;
        var time = timeElement.value;
        if (domain !== '' && time !== '') {
            var editCmd = targetElement.querySelector('[name="editCmd"]');
            editCmd.src = '/icons/edit.png';
            timeElement.classList.add('clock-li-readonly');
            var resultTime = convertShortSummaryTimeToString(convertTimeToSummaryTime(time));
            timeElement.value = resultTime;

            actionUpdateTimeFromList(domain, time);
            actionUpdateList();
        }
    }
}

function isContainsRestrictionSite(domain) {
    return restrictionList.find(x => x.domain == domain) != undefined;
}

function isContainsNotificationSite(domain) {
    return notifyList.find(x => x.domain == domain) != undefined;
}

function isContainsBlackSite(domain) {
    return ignorlist.find(x => x == domain) != undefined;
}

function updateItemFromResctrictoinList(domain, time) {
    restrictionList.find(x => x.domain === domain).time = convertTimeToSummaryTime(time);
}

function updateItemFromNotifyList(domain, time) {
    notifyList.find(x => x.domain === domain).time = convertTimeToSummaryTime(time);
}

function updateignorlist() {
    storage.saveValue(STORAGE_BLACK_LIST, ignorlist);
}

function updateRestrictionList() {
    storage.saveValue(STORAGE_RESTRICTION_LIST, restrictionList);
}

function updateNotificationList() {
    storage.saveValue(STORAGE_NOTIFICATION_LIST, notifyList);
}

function updateNotificationMessage() {
    storage.saveValue(STORAGE_NOTIFICATION_MESSAGE, document.getElementById('notifyMessage').value);
}