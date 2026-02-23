using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GEOEmergency.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationFieldsToEmergency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Emergencies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Emergencies",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Emergencies",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Emergencies");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Emergencies");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Emergencies");
        }
    }
}
