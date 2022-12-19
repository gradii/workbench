/**
 * Ok_Packet
 * @see https://mariadb.com/kb/en/ok_packet/
 */
export class OkPacket {
  affectedRows;
  insertId;
  warningStatus;

  constructor(affectedRows, insertId, warningStatus) {
    this.affectedRows = affectedRows;
    this.insertId = insertId;
    this.warningStatus = warningStatus;
  }
}
