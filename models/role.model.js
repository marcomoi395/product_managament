const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
        title: String,
        description: String,
        permission: {
            type: Array,
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    });

const Permission = mongoose.model("Permission", permissionSchema, "roles");

module.exports = Permission;
