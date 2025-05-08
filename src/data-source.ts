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
import { Customer } from "./entities/customer.entity"
import { CustomerDetails } from "./entities/customer_details.entity"
import { CustomerDevices } from "./entities/customer_devices.entity"
import { CustomerDocuments } from "./entities/customer_documents.entity"
import { CustomerRequests } from "./entities/customer_requests.entity"
import { CustomerRequestHistories } from "./entities/customer_request_histories.entity"
import { Notifications } from "./entities/notifications.entity"
import { Assignment } from "./entities/assignment.entity"

const dbConfig = {
    type: "postgres" as const,
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
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
        VendorDocuments,
        Customer,
        CustomerDetails,
        CustomerDevices,
        CustomerDocuments,
        CustomerRequests,
        CustomerRequestHistories,
        Notifications,
        Assignment
    ],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
    migrationsRun: true,
    subscribers: [],
}

export const AppDataSource = new DataSource(dbConfig) 