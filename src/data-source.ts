import "reflect-metadata"
import { DataSource } from "typeorm"
import { Users } from "./entities/users.entity"
import { Organizations } from "./entities/organizations.entity"
import { ServiceMaster } from "./entities/service_master.entity"
import { SubServiceMaster } from "./entities/sub_service_master.entity"
import { RoleMaster } from "./entities/role_master.entity"
import { Vendor } from "./entities/vendor.entity"
import { VendorDetails } from "./entities/vendor_details.entity"
import { VendorServices } from "./entities/vendor_services.entity"
import { VendorDocuments } from "./entities/vendor_documents.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "casecare",
    synchronize: false,
    logging: true,
    entities: [
        Users,
        Organizations,
        ServiceMaster,
        SubServiceMaster,
        RoleMaster,
        Vendor,
        VendorDetails,
        VendorServices,
        VendorDocuments
    ],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
}) 