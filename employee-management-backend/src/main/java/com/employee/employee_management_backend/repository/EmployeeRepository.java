package com.employee.employee_management_backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.employee_management_backend.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

}