import pool from '../config/db.js';

const argumentos = process.argv.slice(2);
const opcion = argumentos[0];
const descripcion = argumentos[1]
const fecha = argumentos[2];
const monto = argumentos[3]
let cuenta_origen = argumentos[4];
const cuenta_destino = argumentos[5];

const transferencia = async (descripcion, fecha, monto, cuenta_origen,cuenta_destino)=> {
    const actualizarCuentaOrigen = {
        text:'update cuentas set saldo = saldo - $1 where id = $2 returning *',
        values: [monto, cuenta_origen]
    }
    const actualizarCuentaDestino = {
    text:'update cuentas set saldo = saldo + $1 where id = $2 returning *',
    values:[monto,cuenta_destino]
}

    const crearTransferencia = {
        text: 'insert into transferencias (descripcion, fecha, monto, cuenta_origen, cuenta_destino) values ($1,$2,$3,$4,$5) returning *',
        values: [descripcion, fecha, monto, cuenta_origen,cuenta_destino],
    }
    try{
        await pool.query('begin');
        
        await pool.query(actualizarCuentaOrigen);

        await pool.query(actualizarCuentaDestino);

        const result = await pool.query(crearTransferencia);
    
        await pool.query('commit');

        console.log('Transaccion Realizada con exito')
        console.log(result.rows[0])


    }catch(err){console.log(err)}

}


const getSaldo = async (id)=>{
    try{
        const consulta = 'select * from cuentas where id = $1';
         const values = [id];

         const result = await pool.query(consulta, values);
         
         console.log(`el saldo de la cuenta ${cuenta_origen} es: ${result.rows[0].saldo}`);
         //return result.rows;
    }catch(err){console.log(err)}
}

const getTransferencias = async (cuenta_origen)=>{
    const consulta = 'select * from transferencias where cuenta_origen = $1 order by fecha limit 10';
    const values = [cuenta_origen]
    const result = await pool.query(consulta, values);
    console.log(`las ultimas transferencias de la cuenta ${cuenta_origen} son`)
    console.log(result.rows)
}

switch(opcion){
    case 'getSaldo':
        cuenta_origen = argumentos[1];
        getSaldo(cuenta_origen)
        break;
    case 'transferencia':
        transferencia(descripcion, fecha, monto, cuenta_origen,cuenta_destino);
        break;
    case 'getTransferencias':
        let cuenta = argumentos[1]
        getTransferencias(cuenta);
        break;
    
}


getTransferencias(1);