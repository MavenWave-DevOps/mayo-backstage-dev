
import React, {useRef, useState} from 'react';
import { FieldProps,FieldValidation  } from '@rjsf/core';
import Form from "@rjsf/core";


export const InputList = ({
    onChange,
    rawErrors,
    required,
    formData,
}: FieldProps<string>) => {

    const schema = require("./schema.json")
    const formDataa = require("./formData.json")
    const uiSchema = require("./uiSchema.json")



    // const [newListItem, setNewListItem] = useState([]);
    // const [show, setShow] = useState(false);
    // const input = useRef();
    // const changeOpen = () => setShow(true);
    // const changeClose = () => setShow(false);

    // var addToList = e => {
    //     e.preventDefault();
    //     setNewListItem([...newListItem, input.current.value]);
    // };

    return (
        <div className="form">
            
        <Form
            schema={schema}
            uiSchema={uiSchema}
           formData={formDataa}
        >

        </Form>
    </div>
);}

// const [newListItem, setNewListItem] = useState([]);
// const [show, setShow] = useState(false);
// const input = useRef();
// const changeOpen = () => setShow(true);
// const changeClose = () => setShow(false);
//
// var addToList = e => {
//     e.preventDefault();
//     setNewListItem([...newListItem, input.current.value]);
// };
//
// return (
//     <div className="App">
//         <h2>Simple List</h2>
//
//         <Button onClick={changeOpen}>Add to the List</Button>
//
//         <Modal show={show} onHide={changeClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>This is the Title</Modal.Title>
//             </Modal.Header>
//             <form onSubmit={addToList}>
//                 <Modal.Body>
//                     <Form.Group>
//                         <Form.Label>Item</Form.Label>
//                         <br />
//                         <Form.Control type="text" ref={input} placeholder="Normal text" />
//                     </Form.Group>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button type="sumbit">Add to List</Button>
//                 </Modal.Footer>
//             </form>
//         </Modal>
//
//         <ul>
//             {newListItem.map((item, b) => (
//                 <li key={b}>{item}</li>
//             ))}
//         </ul>
//     </div>
// );




export const InputListValidation = (
   
  ) => {
   
    
  };