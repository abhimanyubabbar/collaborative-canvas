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
        <button className="btn btn-basic" onClick={this.openModal.bind(this)}>Create</button>
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
            <button type="button" className="btn btn-primary" onClick={this.createProject.bind(this)}>Submit</button>
          </form>
        </Modal>
      </div>
    );
  }
}

class ProjectState extends React.Component {


  render() {

    return (
      <div>
        <CreateProjectModal 
          onProjectChangeSuccess={this.props.onProjectChangeSuccess}
          onProjectChangeFailure={this.props.onProjectChangeFailure}/>
      </div>
    );
  }
};

export default ProjectState;
