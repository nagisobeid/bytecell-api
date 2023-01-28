const db = require( '../db' )

module.exports = {
    insert : ( tableName, columnData, data ) => {
        const table = new db.sql.Table( tableName )
        table.create = false
        
        for ( const [ colName, attr ] of Object.entries( columnData ) ) {
            table.columns.add( colName.toString() , attr.DataType, attr.Nullable )
        }
    
        for( let i = 0; i < data.length; i++ ) {
            let row = []
            for (const [key, value] of Object.entries(data[i])) {
                row.push( value.toString() )
            }
            table.rows.add( ...row )
        }
        console.log( table )
        return table
    }
    /*,
    update : ( tableName, columnData, data ) => {
        const table = new db.sql.Table( tableName )
        table.create = false
    
        for ( const [ colName, attr ] of Object.entries( columnData ) ) {
            table.columns.add( colName.toString() , attr.DataType, attr.Nullable )
        }
    
        for( let i = 0; i < data.length; i++ ) {
            table.rows.add( data[i].SHPFY_ID.toString(), data[i].BYTECELL_ID.toString() )
        }
    
        return table
    },*/
} 
/*function bulkInsert( tableName, columnData, data ) {
    const table = new db.sql.Table( tableName )
    table.create = false

    for ( const [ colName, attr ] of Object.entries( columnData ) ) {
        table.columns.add( colName.toString() , attr.DataType, attr.Nullable )
    }

    for( let i = 0; i < data.length; i++ ) {
        table.rows.add( data[i].SHPFY_ID.toString(), data[i].BYTECELL_ID.toString() )
    }

    return table
}*/