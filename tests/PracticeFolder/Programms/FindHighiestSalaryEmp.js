let employees=[

    {name:"John",salary:50000},
    {name:"Sam",salary:80000},
    {name:"David",salary:70000}
];

let highest=employees[0];

for(let i=1;i<employees.length;i++){

    if(employees[i].salary>highest.salary){

        highest=employees[i];
    }
}

console.log(highest);