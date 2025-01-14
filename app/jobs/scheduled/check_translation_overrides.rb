# frozen_string_literal: true

module Jobs
  class CheckTranslationOverrides < ::Jobs::Scheduled
    every 1.day

    def execute(args)
      invalid_ids = []
      outdated_ids = []

      TranslationOverride.find_each do |override|
        if override.invalid_interpolation_keys.present?
          invalid_ids << override.id
        elsif override.original_translation_updated?
          outdated_ids << override.id
        end
      end

      TranslationOverride.where(id: outdated_ids).update_all(status: "outdated")
      TranslationOverride.where(id: invalid_ids).update_all(status: "invalid_interpolation_keys")
    end
  end
end
