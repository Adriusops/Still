# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_30_140924) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "activities", force: :cascade do |t|
    t.datetime "consumed_at"
    t.datetime "created_at", null: false
    t.bigint "item_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["item_id"], name: "index_activities_on_item_id"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "content"
    t.datetime "created_at", null: false
    t.integer "duration"
    t.string "image_url"
    t.datetime "published_at"
    t.bigint "source_id", null: false
    t.string "title", null: false
    t.string "type", null: false
    t.datetime "updated_at", null: false
    t.string "url", null: false
    t.index ["source_id"], name: "index_items_on_source_id"
    t.index ["url"], name: "index_items_on_url", unique: true
  end

  create_table "sources", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "etag"
    t.string "image_url"
    t.string "last_modified"
    t.string "name", null: false
    t.string "source_type", null: false
    t.datetime "updated_at", null: false
    t.string "url", null: false
    t.index ["url"], name: "index_sources_on_url", unique: true
  end

  create_table "subscriptions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "paused_until"
    t.bigint "source_id", null: false
    t.string "status", default: "active", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["source_id"], name: "index_subscriptions_on_source_id"
    t.index ["user_id", "source_id"], name: "index_subscriptions_on_user_id_and_source_id", unique: true
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "password_digest"
    t.jsonb "settings"
    t.datetime "updated_at", null: false
    t.string "username", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "activities", "items"
  add_foreign_key "activities", "users"
  add_foreign_key "items", "sources"
  add_foreign_key "subscriptions", "sources"
  add_foreign_key "subscriptions", "users"
end
