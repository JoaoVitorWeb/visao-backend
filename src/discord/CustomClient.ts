import { ApplicationCommandData, Client, Collection } from "discord.js";

export class CustomClient extends Client {
  commands: Collection<string, ApplicationCommandData> = new Collection()
}