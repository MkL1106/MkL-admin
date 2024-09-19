import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Admins({swal}) {
    const [mail, setMail] = useState('');
    const [admins, setAdmins] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchAdmins(); 
    }, []);

    function fetchAdmins(){
        axios.get('/api/admins').then(result => {
            setAdmins(result.data);
        });
    }

    async function saveAdmin(ev) {
        ev.preventDefault();
        const data = { mail };

        try {
            await axios.post('/api/admins', data);
            setMail('');
            setSuccessMessage('Шинэ админ амжилттай нэмэгдлээ!');
            setErrorMessage(''); // Clear any previous error messages
            fetchAdmins();
        } catch (error) {
            console.error('Error adding admin:', error);
            setSuccessMessage(''); // Clear any previous success messages
            setErrorMessage('Failed to add admin.');
        }
    }

    function deleteAdmin(admin){
        swal.fire({
            title: 'Итгэлтэй байна уу?',
            text: `${admin.mail} -г устгамаар байна уу?`,
            showCancelButton: true,
            cancelButtonText: 'Буцах',
            confirmButtonText: 'Устга!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            // when confirmed and promise resolved...
            if(result.isConfirmed){
                const {_id} = admin;
                await axios.delete('/api/admins?_id='+_id);
                fetchAdmins();
            }
        })
    }

    return (
        <Layout>
            <h1>Админууд</h1>
            <label>
                <h1 className="pt-3">Шинэ админ нэмэх</h1>
            </label>
            <form onSubmit={saveAdmin}>
                <div className="flex gap-1">
                    <input 
                        type="text"  
                        placeholder="google email"   
                        onChange={ev => setMail(ev.target.value)}
                        value={mail}
                        className="border border-gray-200 rounded-sm w-full px-3 py-2" 
                    /> 
                    <button 
                        type="submit" 
                        className="btn-admin px-4 py-2 h-auto rounded-md shadow-sm whitespace-nowrap">
                        Админ нэмэх
                    </button>
                </div>
            </form>
            {successMessage && (
                <div className="mt-2 text-green-500">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="mt-2 text-red-500">{errorMessage}</div>
            )}
            <label>
                <h1 className="pt-10">Одоо байгаа админууд</h1>
            </label>
            <table className="basic mt-4">
                <thead> 
                   <tr>
                       <td>Admin google email</td>
                       <td></td>
                       <td></td>
                   </tr>
                </thead>
                <tbody>
                   {admins.length > 0 && admins.map(
                       admin =>(     
                           // eslint-disable-next-line react/jsx-key
                           <tr key={admin._id}>
                               <td >{admin.mail}</td>
                               <td>{(new Date(admin.createdAt)).toLocaleString()}</td>
                               <td>
                               <button 
                                   onClick={() => deleteAdmin(admin)}
                                   className="btn-red">Устгах
                                </button>
                               </td>
                           </tr>
                       )
                   )}
                </tbody>
           </table>
        </Layout>
    )
}


export default withSwal(({swal}, ref) => (
    <Admins swal={swal} />
));