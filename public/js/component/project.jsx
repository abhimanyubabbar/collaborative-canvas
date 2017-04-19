import React from 'react';
import Modal from 'react-modal';
import api from '../utils/api';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
class CreateProjectModal extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      isOpen: false,
      projectName: ""
    };
  }

  handleChange(e) {

    this.setState({
      projectName: e.target.value
    });
  }

  openModal() {
    this.setState({isOpen: true});
  }

  closeModal() {
    this.setState({isOpen: false});
  }

  createProject() {

    if (this.state.projectName == "") {
      return;
    }

    console.log(`Going forward to create the project: ${this.state.projectName}`);

    api.createProject(this.state.projectName)
      .then((project)=> {
        console.log(`Successfully Created the project: ${JSON.stringify(project)}`);
        this.closeModal();
        this.props.onProjectChangeSuccess(project.project);
      })
      .catch((err)=>{
        console.log(`Unable to create a new Project: ${err}`);
        this.props.onProjectChangeFailure(err);
      });
  }

  render() {

    return (
      <div>
        <button className="btn btn-basic btn-block" onClick={this.openModal.bind(this)}>Create</button>
        <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.closeModal.bind(this)}
          style={customStyles}
          contentLabel="Create Project">

          <form>

            <div className="form-group">
              <label htmlFor="">ProjectName</label>
              <input type="text" 
                className="form-control"
                value={this.state.projectName}
                onChange={this.handleChange.bind(this)}
                id="projectName" 
                placeholder="Name"></input>
            </div>

            <hr/>

            <button type="button" 
              className="btn btn-primary" 
              onClick={this.createProject.bind(this)}>
              Submit
            </button>

          </form>
        </Modal>
      </div>
    );
  }
}


class LoadProject extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      isOpen: false,
      projects: {},
      projectName: ""
    };
  }

  openModal() {

    this.setState({
      isOpen: true
    });

  }

  closeModal() {

    this.setState({
      isOpen: false
    });
  }

  changeProject(e) {

    console.log(`PROJECT SELECTOR: Value of the target: ${e.target.value}`);
    console.log(e.target.value);

    this.setState({
      projectName: e.target.value
    });
  }

  handleProjectChange() {

    console.log(`LOAD: Pressed the load button`);
    console.log(`${JSON.stringify(this.state.projectName)}`);

    if (this.state.projectName == "") {
      return;
    }

    console.log(`Project Name Selected: ${JSON.stringify(this.state.projectName)}`);

    const project = this.state.projects[this.state.projectName];
    console.log(`Project Selected: ${project}`);

    if(project == null) {
      return;
    }

    this.props.onChangeComplete(project);
    this.closeModal();
  }

  loadProject() {

    api.getProjects()

      .then((data)=>{

        const projectMap = {};
        const projects = JSON.parse(data).projects;
        for (var i = 0; i < projects.length; i ++ ) {
          projectMap[projects[i].name] = projects[i];
        }

        console.log(projectMap);

        this.setState({
          projects:  projectMap
        });

      })
      .catch((err)=>{
        console.log(`Unable to receive projects: ${err}`);
      });

  }

  render() {

    const projects = this.state.projects;

    var keys = Object.keys(projects);
    const projectList = [];

    for(var i = 0; i < keys.length; i++) {

      const name = projects[keys[i]].name;
      projectList.push(
        <option key={name} value={name}>{name}</option>
      );
    }

    return (

      
      <div>
        <button className="btn btn-basic btn-block" 
          onClick={this.openModal.bind(this)}>Load</button>
        <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.closeModal.bind(this)}
          onAfterOpen={this.loadProject.bind(this)}
          contentLabel="Open Project">

          <div className="form-group">
            <label htmlFor="projectSel">Projects</label>
            <select 
              value={this.state.projectName}
              id="projectSel" 
              className="form-control" 
              onChange={this.changeProject.bind(this)}>
              {projectList}
            </select>
          </div>

          <button 
            type="button" 
            onClick={this.handleProjectChange.bind(this)}
            className="btn btn-primary">Load</button>

        </Modal>
      </div>

    );
  }
}

class ProjectState extends React.Component {


  render() {

    return (
      <div>

        <div className="spacer-top-md">
          <CreateProjectModal
            onProjectChangeSuccess={this.props.onProjectChangeSuccess}
            onProjectChangeFailure={this.props.onProjectChangeFailure}/>
        </div>

        <div className="spacer-top-md">
          <LoadProject
            onChangeComplete={this.props.onProjectChangeSuccess}/>
        </div>

      </div>
    );
  }
};

export default ProjectState;
