"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = __importDefault(require("../models/User"));
class UserRepository {
    async findByEmail(email) {
        return User_1.default.findOne({ email });
    }
    async findById(id) {
        return User_1.default.findById(id).select("-password");
    }
    async create(data) {
        return User_1.default.create(data);
    }
    async setVerified(email) {
        return User_1.default.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
    }
    async existsByEmail(email) {
        const count = await User_1.default.countDocuments({ email });
        return count > 0;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map