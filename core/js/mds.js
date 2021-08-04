function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
var user = { firstName: "First", lastName: "Last" };
document.body.textContent = greeter(user);
