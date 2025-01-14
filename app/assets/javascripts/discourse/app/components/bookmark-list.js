import Component from "@ember/component";
import { action } from "@ember/object";
import { openBookmarkModal } from "discourse/controllers/bookmark";
import { ajax } from "discourse/lib/ajax";
import {
  openLinkInNewTab,
  shouldOpenInNewTab,
} from "discourse/lib/click-track";
import I18n from "I18n";
import { Promise } from "rsvp";
import { inject as service } from "@ember/service";

export default Component.extend({
  dialog: service(),
  classNames: ["bookmark-list-wrapper"],

  @action
  removeBookmark(bookmark) {
    return new Promise((resolve, reject) => {
      const deleteBookmark = () => {
        bookmark
          .destroy()
          .then(() => {
            this.appEvents.trigger(
              "bookmarks:changed",
              null,
              bookmark.attachedTo()
            );
            this._removeBookmarkFromList(bookmark);
            resolve(true);
          })
          .catch((error) => {
            reject(error);
          });
      };
      if (!bookmark.reminder_at) {
        return deleteBookmark();
      }
      this.dialog.deleteConfirm({
        message: I18n.t("bookmarks.confirm_delete"),
        didConfirm: () => deleteBookmark(),
        didCancel: () => resolve(false),
      });
    });
  },

  @action
  screenExcerptForExternalLink(event) {
    if (event?.target?.tagName === "A") {
      if (shouldOpenInNewTab(event.target.href)) {
        openLinkInNewTab(event, event.target);
      }
    }
  },

  @action
  editBookmark(bookmark) {
    openBookmarkModal(bookmark, {
      onAfterSave: (savedData) => {
        this.appEvents.trigger(
          "bookmarks:changed",
          savedData,
          bookmark.attachedTo()
        );
        this.reload();
      },
      onAfterDelete: () => {
        this.reload();
      },
    });
  },

  @action
  clearBookmarkReminder(bookmark) {
    return ajax(`/bookmarks/${bookmark.id}`, {
      type: "PUT",
      data: { reminder_at: null },
    }).then(() => {
      bookmark.set("reminder_at", null);
    });
  },

  @action
  togglePinBookmark(bookmark) {
    bookmark.togglePin().then(this.reload);
  },

  _removeBookmarkFromList(bookmark) {
    this.content.removeObject(bookmark);
  },
});
