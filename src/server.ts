import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage/", async(req: express.Request, res: express.Response) => {
    const { image_url } = req.query;

    if (!image_url) {
      return res.status(400).send("Image url required");
    }

    try {
      const filteredImage = await filterImageFromURL(image_url)
      await res.status(200).sendFile(filteredImage, (err) => {
        deleteLocalFiles([filteredImage])
        if (err) { return res.status(422).send("Error: " + err.toString()); }
      })
    } catch (err) {
      res.status(422).send("Error: " + err.toString());
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
