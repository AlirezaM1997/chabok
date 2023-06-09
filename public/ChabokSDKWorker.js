/*! chabokpush - 2.0.1 | (c) 2017, 2021  ADP digital | ISC | http://chabokpush.com/ */
!(function (t, n) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd
    ? define("chabokpush", [], n)
    : "object" == typeof exports
    ? (exports.chabokpush = n())
    : (t.chabokpush = n());
})("undefined" != typeof self ? self : this, function () {
  return (function (t) {
    function n(o) {
      if (i[o]) return i[o].exports;
      var e = (i[o] = { i: o, l: !1, exports: {} });
      return t[o].call(e.exports, e, e.exports, n), (e.l = !0), e.exports;
    }
    var i = {};
    return (
      (n.m = t),
      (n.c = i),
      (n.d = function (t, i, o) {
        n.o(t, i) || Object.defineProperty(t, i, { configurable: !1, enumerable: !0, get: o });
      }),
      (n.n = function (t) {
        var i =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return n.d(i, "a", i), i;
      }),
      (n.o = function (t, n) {
        return Object.prototype.hasOwnProperty.call(t, n);
      }),
      (n.p = ""),
      n((n.s = 162))
    );
  })({
    162: function (t, n, i) {
      "use strict";
      self.addEventListener("push", function (t) {
        var n = null;
        try {
          n = t.data.json();
        } catch (n) {
          return void t.waitUntil(self.registration.showNotification("New message", { body: "You have a new message." }));
        }
        n &&
          (n.actions &&
            (n.actions.forEach(function (t) {
              t.action || (t.action = t.id);
            }),
            n.mediaUrl && (n.image = n.mediaUrl)),
          (n.data = JSON.parse(JSON.stringify(n))),
          n.silent ||
            t.waitUntil(
              self.registration
                .showNotification(n.title, n)
                .then(function (t) {
                  o.broadcastNotificationAction("SHOWN", n.data);
                })
                .catch(function (t) {})
            ));
      }),
        self.addEventListener(
          "pushsubscriptionchange",
          function (t) {
            self.registration.pushManager
              .getSubscription()
              .then(function (n) {
                t.waitUntil(
                  self.registration.pushManager.subscribe(n).then(function (t) {
                    o.broadcastUpdatePushToken(t);
                  })
                );
              })
              .catch(function (t) {});
          },
          !1
        ),
        self.addEventListener("notificationclose", function (t) {
          var n = t.notification.data;
          n && o.broadcastNotificationAction("DISMISSED", n);
        }),
        self.addEventListener("notificationclick", function (t) {
          t.notification.close();
          var n = "/",
            i = t.notification.data;
          if (
            (t && t.notification && t.notification.data && t.notification.data.clickUrl && (n = t.notification.data.clickUrl), i)
          )
            if (t.action) {
              var e = i.actions.find(function (n) {
                return n.action === t.action;
              });
              e && (n = e.url || n), (i.actionId = t.action), o.broadcastNotificationAction("ACTION_TAKEN", i);
            } else o.broadcastNotificationAction("OPENED", i);
          t.waitUntil(
            self.clients.matchAll({ type: "window" }).then(function (t) {
              for (var i = 0; i < t.length; i += 1) {
                var o = t[i];
                if ((o.url === n || o.url === n + "/") && "focus" in o) return void o.focus();
              }
              self.clients.openWindow && self.clients.openWindow(n);
            })
          );
        });
      var o = {
        broadcastNotificationAction: function (t, n) {
          (n.actionType = t), (n.actionTs = Date.now()), this.broadcast("notification." + t, n);
        },
        broadcastUpdatePushToken: function (t) {
          this.broadcast("notificationToken.update", t);
        },
        broadcast: function (t, n) {
          self.clients.matchAll({ type: "window", includeUncontrolled: !0 }).then(function (i) {
            var o = !0,
              e = !1,
              a = void 0;
            try {
              for (var c, r = i[Symbol.iterator](); !(o = (c = r.next()).done); o = !0) {
                c.value.postMessage({ command: t, payload: JSON.stringify(n) });
              }
            } catch (t) {
              (e = !0), (a = t);
            } finally {
              try {
                !o && r.return && r.return();
              } finally {
                if (e) throw a;
              }
            }
          });
        },
      };
      t.exports = o;
    },
  });
});
