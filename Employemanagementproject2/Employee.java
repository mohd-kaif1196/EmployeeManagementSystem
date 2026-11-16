public class Employee {

    int id;
    String name;
    String email;
    String department;
    double salary;

    // Constructor for existing employee
    Employee(int id, String name, String email,
             String department, double salary) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.salary = salary;
    }

    // Constructor for new employee
    Employee(String name, String email,
             String department, double salary) {

        this.name = name;
        this.email = email;
        this.department = department;
        this.salary = salary;
    }
}