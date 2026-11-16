import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class EmployeeDAO {

    // ADD EMPLOYEE
    public void addEmployee(Employee emp) {

        String sql = "INSERT INTO employee(name, email, department, salary) VALUES (?, ?, ?, ?)";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, emp.name);
            ps.setString(2, emp.email);
            ps.setString(3, emp.department);
            ps.setDouble(4, emp.salary);

            ps.executeUpdate();

            System.out.println("Employee added successfully!");

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // VIEW ALL EMPLOYEES
    public void viewEmployees() {

        String sql = "SELECT * FROM employee";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                System.out.println(
                    rs.getInt("id") + " | " +
                    rs.getString("name") + " | " +
                    rs.getString("email") + " | " +
                    rs.getString("department") + " | " +
                    rs.getDouble("salary")
                );
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // SEARCH EMPLOYEE
    public void searchEmployee(int id) {

        String sql = "SELECT * FROM employee WHERE id = ?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, id);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                System.out.println(
                    rs.getInt("id") + " | " +
                    rs.getString("name") + " | " +
                    rs.getString("email") + " | " +
                    rs.getString("department") + " | " +
                    rs.getDouble("salary")
                );

            } else {
                System.out.println("Employee not found.");
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // DELETE EMPLOYEE
    public void deleteEmployee(int id) {

        String sql = "DELETE FROM employee WHERE id = ?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, id);

            int rows = ps.executeUpdate();

            if (rows > 0) {
                System.out.println("Employee deleted successfully!");
            } else {
                System.out.println("Employee not found.");
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // UPDATE EMPLOYEE
    public void updateEmployee(Employee emp) {

        String sql = "UPDATE employee SET name=?, email=?, department=?, salary=? WHERE id=?";

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, emp.name);
            ps.setString(2, emp.email);
            ps.setString(3, emp.department);
            ps.setDouble(4, emp.salary);
            ps.setInt(5, emp.id);

            int rows = ps.executeUpdate();

            if (rows > 0) {
                System.out.println("Employee updated successfully!");
            } else {
                System.out.println("Employee not found.");
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}