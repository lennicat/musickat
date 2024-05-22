const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
// Skips the current song in the queue


module.exports = {
    data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips the current song in the queue.'),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        const track = queue.currentTrack

        try {
            queue.node.skip();

            return interaction.followUp(`**${track.title}** has been skipped!`);
        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
}