# COLLABORATIVE CANVAS
Real time collaboration over the canvas between the peers over the web.

## FEATURES:
The collaborative canvas exposes the below features:

1. **Session** : It allows the user to create a new session to work on collaboratively as well as load an existing session that any other user might have created. Once user creates or loads the session, all the changes made to the canvas are emitted by the client to the server using `sockets`. Any other user joined to the session will receive the updates.

2. **Properties**: A user can freely draw onto the canvas as well as upload images to the canvas. By default the brush stroks added cannot be modified in terms of resizing and movement from the original location. On the other hand, images can freely resized and moved along the X and Y axis. This allows to user to better scale the image in regard to the canvas size.

3. **Undo-Redo** : The project also provides ability to undo-redo the changes made to the canvas. By default the objects added to the canvas which are brush strokes cannot be modified in terms of size, location by the user. Therefore they become an excellent candidate for the `undo-redo` feature.

4. **Canvas Properties**: A user can change basic properties of the canvas like:
  + *Color*: The color of brush stroke could be easily changed. For this purpose a color pallete is provided for the user to make there choice.
  + *Width*: The width of the brush stroke could also be easily changed by the user. The user is provided with some defaults.
  + *DrawingMode*: By default any change made to the canvas is made in the `drawingMode` which means that objects can only be added to the canvas but cannot be modified. This means that by default the user could only upload the images with the default size onto the canvas. This is resolved by unchecking the `DrawingMode` checkbox. Now the image could easily resized and moved onto the canvas plane.


## EXTERNAL LIBRARIES:

The project uses these core external libraries to allow for the above feature set:

1. **Sockets** : We use websockets to provide real-time updates to the users working on the same session.
2. **Fabricjs** : Fabricjs is used as a canvas library for enabling the users to draw with brush and upload images to the canvas. The canvas fires `object:added` and `object:modified` among many others to track the movement of the user on the canvas.
3. **Reactjs** : It is the main View rendering library used. Different components relating to different parts of the project are created and combined together to provide feature set.
4. **LowDB** : In order to store the events and replay them when user presses browser refresh, we store the events in a `JSON` based object store. The `API` is simple and intuitive to allow for the events to be stored and retrieved.
5. **Bootstrap** : Bootstrap libary is used to provide CSS support.
6. **Yarn** : Yarn is the package manager used to track and lock the dependencies for the project.

### BUILD:

#### Preferred Way

**Requirements** : docker (Dockerfile) / ruby (Rakefile)

The preferred way to build the project is through the use of `docker`. The project contains `Dockerfile` which contains the build steps for the project. Therefore to build and run the project:

1. `docker build -t tagname` where tagname is the name of the image built.
2. `docker run -d tagname` to run the image with the name tagname.


To better shorten the build efforts, Rakefile is provided to perform the above tasks.

1. `rake build` builds the project.
2. `rake run` will first build the project and then start the server onto the host.

#### Lengthy Way

**Requirements**: `Node v 4.7 or greater`, `yarn`, `npm`

1. The project contains `package.json` which exposes the dependencies for the project. Before the dependencies could be installed, we need to install some external libraries for one of the dependency `node-canvas` which is used to store the canvas state onto the server. The dependencies could be installed for the environment using the link provided.

2. After that we can do `yarn install` to install all the dependencies.
3. We need to run `yarn run webpack` after it to create the bundle for the client code.
4. Finally we start serving the project by `yarn start`.


The project runs on `8080` port. For now this port value is not configurable therefore any attempt to run the project on a different port will fail.


