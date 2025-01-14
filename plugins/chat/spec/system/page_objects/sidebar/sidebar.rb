# frozen_string_literal: true

module PageObjects
  module Pages
    class Sidebar < PageObjects::Pages::Base
      PUBLIC_CHANNELS_SECTION_SELECTOR = ".sidebar-section[data-section-name='chat-channels']"
      DM_CHANNELS_SECTION_SELECTOR = ".sidebar-section[data-section-name='chat-dms']"

      def has_no_public_channels_section?
        has_no_css?(PUBLIC_CHANNELS_SECTION_SELECTOR)
      end

      def channels_section
        find(PUBLIC_CHANNELS_SECTION_SELECTOR)
      end

      def channels_section
        find(PUBLIC_CHANNELS_SECTION_SELECTOR)
      end

      def dms_section
        find(DM_CHANNELS_SECTION_SELECTOR)
      end

      def open_browse
        channels_section.find(".sidebar-section-header-button", visible: false).click
      end

      def open_channel(channel)
        find(".sidebar-section-link[href='/chat/c/#{channel.slug}/#{channel.id}']").click
      end

      def find_channel(channel)
        find(".sidebar-section-link[href='/chat/c/#{channel.slug}/#{channel.id}']")
        self
      end
    end
  end
end
