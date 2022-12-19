import { Collation } from '../const/collations';
import { FieldTypes } from '../const/field-type';
import { Capabilities } from '../const/capabilities';
import { Packet } from '../io/packet';

/**
 * Column definition
 * @see https://mariadb.com/kb/en/library/resultset/#column-definition-packet
 */
export class ColumnDef {
  _parse;
  dataTypeName;
  dataTypeFormat;

  collation;
  columnLength;
  columnType: number;
  flags;
  scale;
  type;

  constructor(packet, info) {
    this._parse = new StringParser(packet);
    if (info.serverCapabilities & Capabilities.MARIADB_CLIENT_EXTENDED_TYPE_INFO) {
      const subPacket = packet.subPacketLengthEncoded();
      while (subPacket.remaining()) {
        switch (subPacket.readUInt8()) {
          case 0:
            this.dataTypeName = subPacket.readAsciiStringLengthEncoded();
            break;

          case 1:
            this.dataTypeFormat = subPacket.readAsciiStringLengthEncoded();
            break;

          default:
            // skip data
            const len = subPacket.readUnsignedLength();
            if (len) {
              subPacket.skip(len);
            }
            break;
        }
      }
    }

    packet.skip(1); // length of fixed fields
    this.collation = Collation.fromIndex(packet.readUInt16());
    this.columnLength = packet.readUInt32();
    this.columnType = packet.readUInt8();
    this.flags = packet.readUInt16();
    this.scale = packet.readUInt8();
    this.type = FieldTypes[this.columnType];
  }

  db() {
    return this._parse.packet.readString(this._parse.dbOffset, this._parse.dbLength);
  }

  schema() {
    return this._parse.packet.readString(this._parse.dbOffset, this._parse.dbLength);
  }

  table() {
    return this._parse.packet.readString(this._parse.tableOffset, this._parse.tableLength);
  }

  orgTable() {
    return this._parse.packet.readString(this._parse.orgTableOffset, this._parse.orgTableLength);
  }

  name() {
    return this._parse.packet.readString(this._parse.nameOffset, this._parse.nameLength);
  }

  orgName() {
    return this._parse.packet.readString(this._parse.orgNameOffset, this._parse.orgNameLength);
  }
}

/**
 * String parser.
 * This object permits to avoid listing all private information to metadata object.
 */
export class StringParser {
  dbLength;
  dbOffset;
  tableLength;
  tableOffset;
  orgTableLength;
  orgTableOffset;
  nameLength;
  nameOffset;
  orgNameLength;
  orgNameOffset;
  packet;

  constructor(packet: Packet) {
    packet.skip(4); // skip 'def'

    this.dbLength = packet.readUnsignedLength();
    this.dbOffset = packet.pos;
    packet.skip(this.dbLength);

    this.tableLength = packet.readUnsignedLength();
    this.tableOffset = packet.pos;
    packet.skip(this.tableLength);

    this.orgTableLength = packet.readUnsignedLength();
    this.orgTableOffset = packet.pos;
    packet.skip(this.orgTableLength);

    this.nameLength = packet.readUnsignedLength();
    this.nameOffset = packet.pos;
    packet.skip(this.nameLength);

    this.orgNameLength = packet.readUnsignedLength();
    this.orgNameOffset = packet.pos;
    packet.skip(this.orgNameLength);
    this.packet = packet;
  }
}
