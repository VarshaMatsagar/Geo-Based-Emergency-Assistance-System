using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GEOEmergency.Migrations
{
    /// <inheritdoc />
    public partial class AddTargetDepartmentToEmergency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TargetDepartment",
                table: "Emergencies",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetDepartment",
                table: "Emergencies");
        }
    }
}
