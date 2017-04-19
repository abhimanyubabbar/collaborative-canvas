import React from 'react';
import Modal from 'react-modal';
import api from '../utils/api';

const loadProjectStyle = {
  content: {
    position: 'fixed',
    top: '25%',
    left: '25%',
    right: '25%',
    bottom: '25%'
  }
};


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
          style={loadProjectStyle}
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
 export default LoadProject;
