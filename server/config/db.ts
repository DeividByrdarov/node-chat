import * as mongoose from "mongoose"

export default async () => {
  await mongoose.connect(
    "mongodb://localhost/node-chat",
    {
      useNewUrlParser: true,
    }
  )

  console.log("Connected to MongoDB :)")
}
