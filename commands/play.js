const search = require("youtube-search")
const ytdl = require("ytdl-core")
const configData = require("../config.json")

let gQueue = []

async function streamNextSong(connection, voiceChannel, message) {
  // create stream
  const stream = await ytdl(gQueue[0].link, {
    filter: "audioonly",
  })
  const dispatcher = await connection.playStream(stream)

  dispatcher.on("end", () => {
    gQueue.shift() // remove palyed song

    if (gQueue.length != 0) {
      message.channel.send(`Now playing: ${gQueue[0].title}`)
      streamNextSong(connection, voiceChannel, message)
    } else {
      voiceChannel.leave()
      message.channel.send("End of queue...")
    }
  })

  dispatcher.on("error", error => {
    console.error(error)
  })
}

module.exports = {
  name: "play",
  description:
    "Plays youtube video audio via the voice channel.  Please join the channel before starting your stream...",
  execute(message, args, serverQueue) {
    if (message.channel.type !== "text") return

    if (args.length == 0) message.channel.send("Please enter a phrase to search for a music video.")

    const { voiceChannel } = message.member

    if (!voiceChannel) {
      return message.reply(`Please join the voice channel before`)
    }
    console.log(args)

    // If the client is not connected to a VC then initiate new music instance
    if (!voiceChannel.connection) {
      console.log("init music")

      voiceChannel.join().then(connection => {
        search(
          args.join(" "),
          {
            maxResults: 1,
            type: "video",
            key: configData["yt-api-token"],
          },
          (err, results) => {
            if (err) {
              message.channel.send(
                "ERROR: something went wrong... "
              )
              console.error(err)
            }

            // push audio into queue
            gQueue.push({
              link: results[0].link,
              desc: results[0].description,
              title: results[0].title,
            })

            message.reply(`Now playing: ${gQueue[0].title}`)

            streamNextSong(connection, voiceChannel, message)
          }
        )
      })
    } else {
      console.log("Adding to queue")
      search(
        args.join(" "),
        {
          maxResults: 1,
          type: "video",
          key: configData["yt-api-token"],
        },
        (err, results) => {
          if (err) {
            message.channel.send(
              "ERROR: something went wrong..."
            )
            console.error(err)
          }

          // push audio into queue
          gQueue.push({
            link: results[0].link,
            desc: results[0].description,
            title: results[0].title,
          })

          message.reply("Added!")
        }
      )
    }
  },
}
