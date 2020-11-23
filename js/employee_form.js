let isUpdate = false;
let employeePayrollObj ={};
window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input', function() {
        if(name.value.length == 0) {
            textError.textContent = "";
            return;
        }
        try {
            (new EmployeePayrollData()).name = name.value;
            textError.textContent = "";
        }
        catch(error) {
            textError.textContent = error;
        }
    });

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function() {
        output.textContent = salary.value;
    });
    checkForUpdate();
});

const save = (event) => {
    try {
        let employeePayrollData = createEmployeePayroll();
        createAndUpdateStorage(employeePayrollData);
        resetForm();
    } catch(error) {
        alert(error);
    }
}

function createAndUpdateStorage(employeePayrollData) {

    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));

    if(employeePayrollList != undefined) {
        employeePayrollList.push(employeePayrollData);
    } else {
        employeePayrollList = [employeePayrollData];
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createEmployeePayroll = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    let max = 0;
    if(employeePayrollList){
        for(const empData of employeePayrollList){
            if(max<empData._id)
            max = empData._id;
        }
    }
    let employeePayrollData = new EmployeePayrollData();
    try {
      employeePayrollData.id = parseInt(max) + 1;
      employeePayrollData.name = getInputValueById('#name');
      employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
      employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
      employeePayrollData.department = getSelectedValues('[name=department]');
      employeePayrollData.salary = getInputValueById('#salary');
      employeePayrollData.note = getInputValueById('#notes');
      employeePayrollData.startDate = new Date(getInputValueById('#year'), getInputValueById('#month'),
        getInputValueById('#day'));
      return employeePayrollData;
    } catch (error) {
      alert(error);
      throw "Unable To Populate Employee Payroll Object!"
    }
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if (item.checked) {
        selItems.push(item.value);
        }
    });
    return selItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
} 

const resetForm = () => {
    setValue('#name','');
    setTextValue('#name-error','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#notes','');
    setValue('#day','01');
    setValue('#month','0');
    setValue('#year','2020');
    setTextValue('#date-error','');
}
  

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
      item.checked = false;
    });
}
  
const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}
  
const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const checkForUpdate = () =>{
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson?true:false;
    if(!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

const setForm = () => {
    setValue('#name',employeePayrollObj._name);
    setSelectedValues('[name=profile]',employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]',employeePayrollObj._gender);
    setSelectedValues('[name=department]',employeePayrollObj._departments);
    setValue('#salary',employeePayrollObj._salary);
    setValue('#notes',employeePayrollObj._notes);
    setTextValue('.salary-output',employeePayrollObj._salary);
    let date= stringifyDate(employeePayrollObj._startDate).split(" ");
    setSelectedIndex('#day',0);
    setSelectedIndex('#month',0);
    setSelectedIndex('#year',0);
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item =>{
        if(Array.isArray(value)){
            if(value.includes(item.value)){
                item.checked = true;
            }
        }
        else if (item.value===value)
            item.checked = true;
    })
}

const setSelectedIndex =(id,index) => {
    const element =document.querySelector(id);
    element.selectedIndex = index;
}