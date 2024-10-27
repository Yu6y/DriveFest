using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class literal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkshopComments_WorkshopDescriptions_WokrshopDescriptionId",
                table: "WorkshopComments");

            migrationBuilder.RenameColumn(
                name: "WokrshopDescriptionId",
                table: "WorkshopComments",
                newName: "WorkshopDescriptionId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkshopComments_WokrshopDescriptionId",
                table: "WorkshopComments",
                newName: "IX_WorkshopComments_WorkshopDescriptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkshopComments_WorkshopDescriptions_WorkshopDescriptionId",
                table: "WorkshopComments",
                column: "WorkshopDescriptionId",
                principalTable: "WorkshopDescriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkshopComments_WorkshopDescriptions_WorkshopDescriptionId",
                table: "WorkshopComments");

            migrationBuilder.RenameColumn(
                name: "WorkshopDescriptionId",
                table: "WorkshopComments",
                newName: "WokrshopDescriptionId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkshopComments_WorkshopDescriptionId",
                table: "WorkshopComments",
                newName: "IX_WorkshopComments_WokrshopDescriptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkshopComments_WorkshopDescriptions_WokrshopDescriptionId",
                table: "WorkshopComments",
                column: "WokrshopDescriptionId",
                principalTable: "WorkshopDescriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
