const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue, QueryType } = require('discord-player');
const { youtubeURLRegex } = require('youtube-ext/dist/utils');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('addsong')
		.setDescription('Adds a song to the queue ')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song to play in voice channel')),
    async execute(interaction) {
            const player = useMainPlayer();
            const queue = useQueue(interaction.guild);
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
            const query = interaction.options.getString('song', true); // we need input/query to play
            const res = await player.search(query, {
                requestedBy: interaction.member,
                searchEngine: QueryType.AUTO
            });
        
            // let's defer the interaction as things can take time to process
            await interaction.deferReply();

            try {
                queue.addTrack(res.tracks[0], 0);

                return interaction.followUp(`**${res.tracks[0].title}** added to queue!`);
            } catch (e) {
                return interaction.followUp(`Something went wrong: ${e}`);
            }
        
        }
}