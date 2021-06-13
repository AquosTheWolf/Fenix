import { Message, PermissionResolvable } from "discord.js";

export function checkPermission(message: Message, permission: PermissionResolvable) {
  if (!message.member!.hasPermission(permission)) {
      throw new Error(`This requires \`${permission}\` permissions, but you do not have them!`);
  }else{
      return true
  }
}

export function checkBotPermission(message: Message, permission: PermissionResolvable) {
  if (!message.guild!.me!.hasPermission(permission)) {
      throw new Error(`This requires me to have \`${permission}\` permissions, but I do not have them!`);
  }
}