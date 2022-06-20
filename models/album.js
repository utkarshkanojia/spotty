const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		artist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Artist",
		},
		tracks: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Track",
			},
		],
		thumbnail: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Album = mongoose.model("Album", albumSchema);
module.exports = Album;
