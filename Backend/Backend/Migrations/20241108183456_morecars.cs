using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class morecars : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserCarId",
                table: "CarRegistries",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserCarId",
                table: "CarExpenses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserCars",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCars", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserCars_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CarRegistries_UserCarId",
                table: "CarRegistries",
                column: "UserCarId");

            migrationBuilder.CreateIndex(
                name: "IX_CarExpenses_UserCarId",
                table: "CarExpenses",
                column: "UserCarId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCars_UserId",
                table: "UserCars",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_CarExpenses_UserCars_UserCarId",
                table: "CarExpenses",
                column: "UserCarId",
                principalTable: "UserCars",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CarRegistries_UserCars_UserCarId",
                table: "CarRegistries",
                column: "UserCarId",
                principalTable: "UserCars",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CarExpenses_UserCars_UserCarId",
                table: "CarExpenses");

            migrationBuilder.DropForeignKey(
                name: "FK_CarRegistries_UserCars_UserCarId",
                table: "CarRegistries");

            migrationBuilder.DropTable(
                name: "UserCars");

            migrationBuilder.DropIndex(
                name: "IX_CarRegistries_UserCarId",
                table: "CarRegistries");

            migrationBuilder.DropIndex(
                name: "IX_CarExpenses_UserCarId",
                table: "CarExpenses");

            migrationBuilder.DropColumn(
                name: "UserCarId",
                table: "CarRegistries");

            migrationBuilder.DropColumn(
                name: "UserCarId",
                table: "CarExpenses");
        }
    }
}
