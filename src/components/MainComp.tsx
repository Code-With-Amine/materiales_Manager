import { Link } from "react-router-dom";
import addBenificier from "../assets/add-benificaire.png";
import addSchool from '../assets/add-school.png';
import addMatirale from '../assets/add-material.png';
import school from '../assets/school.png';
import materiale from "../assets/see-materials.png";
import benficaire from '../assets/see-benificaires.png';

function MainComp() {
  return (
    <div className='main-container'>
        <div className='item-link'> <img src={school} alt="school icon"/> <Link to='/schools'>Schools</Link></div>
        <div className='item-link'> <img src={materiale} alt="materiale icon"/> <Link to='/materiales'>materiales</Link></div>
        <div className='item-link'> <img src={benficaire} alt="Beneficiaires icon"/> <Link to='/Beneficiaires'>Beneficiaires</Link></div>

        <div className='item-link'> <img src={addSchool} alt="add school icon"/> <Link to='/addSchools'>Add Schools</Link></div>
        <div className='item-link'> <img src={addMatirale} alt="add matirale icon"/> <Link to='/addMatriales'>Add materiales</Link></div>
        <div className='item-link'> <img src={addBenificier} alt="icon"/> <Link to='/AddBenificier'>Add benificier</Link></div> 
       </div>
  )
}

export default MainComp