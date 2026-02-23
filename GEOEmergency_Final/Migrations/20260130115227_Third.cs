using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GEOEmergency.Migrations
{
    /// <inheritdoc />
    public partial class Third : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Emergencies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Emergencies",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Emergencies",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "TargetDepartment",
                table: "Emergencies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Emergencies");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Emergencies");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Emergencies");

            migrationBuilder.DropColumn(
                name: "TargetDepartment",
                table: "Emergencies");
        }
    }
}
