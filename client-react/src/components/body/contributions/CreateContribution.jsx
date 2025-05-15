import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import React from "react";
import axios from "axios";

const CreateContribution = (props) => {//{setUsers}
    const [visible, setVisible] = useState(false);
    const [donor, setDonor] = useState();
    const [sumContribution, setSumContribution] = useState();
    const [date, setDate] = useState();
   

    const SaveContribution = async (e) => {
       const res = await axios.post('http://localhost:1111/contribution', { donor, date, sumContribution })
       props.getAllContributions()//////////////////////////
        // setUsers(res.data)
    }
    return (<>
        <div className="card flex justify-content-start">
            <Button label="Add new cont" icon="pi pi-plus" onClick={() => setVisible(true)} />
            <Dialog
                visible={visible}
                modal
                onHide={() => { if (!visible) return; setVisible(false); }}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="donor" className="text-primary-50 font-semibold">
                                Donor
                            </label>
                            <InputText onChange={(e) => { setDonor(e.target.value) }} className="bg-white-alpha-20 border-none p-3 text-primary-50" style={{ required: true }} />

                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="sumContribution" className="text-primary-50 font-semibold">
                            Contribution Sum
                            </label>
                            <InputText onChange={(e) => { setSumContribution(e.target.value) }} className="bg-white-alpha-20 border-none p-3 text-primary-50" style={{ required: true }} />
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="date" className="text-primary-50 font-semibold">
                                date
                            </label>
                            <InputText onChange={(e) => { setDate(e.target.value) }} className="bg-white-alpha-20 border-none p-3 text-primary-50" style={{ required: true }} />
                        </div>
                      
                        <div className="flex align-items-center gap-2">
                            {/* <Button label="Save" icon="pi pi-check" onClick={(e) => { SaveTodo(e); hide(e) }} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-20"></Button> */}
                            <Button label="Cancel" icon="pi pi-times" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}
            ></Dialog>
        </div>
    </>)
}
export default CreateContribution