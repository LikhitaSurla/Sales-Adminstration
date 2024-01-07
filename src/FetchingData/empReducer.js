export const firststate = {
    empid:"",
    empname:"",
    age:0,
    gender:"",
    phonenumber:0,
    salary:0,
    bonus:0,
};
export const empReducer =(state,action)=>{
    switch(action.type){

        case 'changeInput':
            return {...state,[action.payload.name]:action.payload.value}

        default:
            return state
    }
    
}