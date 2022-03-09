/**
 * Created by naijun on 2022/02/23
 * Copyright (c) naijun.
 * This code is licensed under the MIT Licensing Principles.
 */

const ImageDB = com.xfl.msgbot.script.api.legacy.ImageDB; // 메봇만 됨
const Replier = com.xfl.msgbot.script.api.legacy.SessionCacheReplier;

const scriptName = ""; // 아마 꼭 넣어주세요

// api2 아님
function onMessage(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (msg === '!하이') {
        replier.reply(room);
    }
}

function onNotificationPosted(notif, sm) {
    if(!notif.getPackageName().startsWith('com.kakao.t')) return;
    const extender = new android.app.Notification.WearableExtender(notif.getNotification());
    extender.getActions().forEach((action) => {
        if (
            new java.lang.String(String(action.title).toLowerCase()).contains('reply')
            || new java.lang.String(String(action.title).toString().toLowerCase()).contains('답장')
        ) {
            let data = notif.getNotification().extras;
            let sender = data.get('android.messagingUser').getName().toString();
            let msg = data.get('android.text').toString();
            let room = data.getString('android.subText') || data.getString("android.title")
            let isGroupChat = data.getBoolean('android.isGroupConversation')
            let packageName = notif.getPackageName();
            const replier = new Replier(packageName, action, room, false, scriptName)
            const bitmap = data.get('android.messagingUser').getIcon().getBitmap();
            const imageDB = new ImageDB(bitmap, bitmap);
            com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
            onMessage.call(this, room, msg, sender, isGroupChat, replier, imageDB, packageName);
        }
    })
}