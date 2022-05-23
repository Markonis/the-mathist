require 'test_helper'

class SettingTest < ActiveSupport::TestCase
  test "get" do
    expected = {'value' => 123}
    result = Setting.get 'wa_credits'

    assert_equal expected, result
  end

  test "get_single_value" do
    expected = 123
    result = Setting.get_single_value 'wa_credits'

    assert_equal expected, result
  end

  test "set" do
    expected = 2
    Setting.set 'test', 'test'
    Setting.set 'wa_credits', '{"value": 5}'
    result = Setting.count

    assert_equal expected, result
  end

  test "set_single_value" do
    Setting.set_single_value 'wa_credits', 4
    expected = {'value' => 4}
    result = JSON.parse settings(:wa_credits).value

    assert_equal expected, result
  end

  test "should validate presence of both key and value" do
    no_key = Setting.create(value: 'test')
    no_value = Setting.create(key: 'test')

    assert_not no_key.valid?
    assert_not no_value.valid?
  end
end
