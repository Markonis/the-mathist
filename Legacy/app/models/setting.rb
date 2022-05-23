class Setting < ActiveRecord::Base
  validates_presence_of :key, :value

  def self.get key
    setting = Setting.where(key: key).first
    if setting.present?
      JSON.parse setting.value
    else
      nil
    end
  end

  def self.get_single_value key
    json = get key
    if json.present?
      json['value']
    else
      nil
    end
  end

  def self.set key, value
    setting = Setting.where(key: key).first
    if setting.present?
      setting.value = value
      setting.save
    else
      setting = Setting.create(key: key, value: value)
    end
    setting
  end

  def self.set_single_value key, value
    set key, {value: value}.to_json
  end
end
