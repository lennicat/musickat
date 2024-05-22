const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Replies with Pong!')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song to play in voice channel')),
    async execute(interaction) {
            const player = useMainPlayer();
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
            const query = interaction.options.getString('song', true); // we need input/query to play
        
            // let's defer the interaction as things can take time to process
            await interaction.deferReply();
        
            try {
                const { track } = await player.play(channel, query, {
                    nodeOptions: {
                        metadata: interaction, // we can access this metadata object using queue.metadata later on
                        bufferingTimeout: 15000,
                        leaveOnStop: false,
                        leaveOnEnd: true,
                        leaveOnEndCooldown: 15000,
                        leaveOnEmpty: true, //If the player should leave when the voice channel is empty
				        leaveOnEmptyCooldown: 300000, //Cooldown in ms
                    }
                });
        
                return interaction.followUp(`**${track.title}** enqueued!`);
            } catch (e) {
                // let's return error if something failed
                return interaction.followUp(`Something went wrong: ${e}`);
            }
        }
}