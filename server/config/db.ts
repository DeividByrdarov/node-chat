import * as mongoose from "mongoose"

export default async () => {
  await mongoose.connect(
    process.env.DATABASE_URL || "mongodb://localhost/node-chat",
    {
      useNewUrlParser: true,
    }
  )

  console.log("Connected to MongoDB :)")
}
