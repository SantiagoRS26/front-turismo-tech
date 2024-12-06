'use client';

import { Sidebar } from "@/components/ui/sidebar";
import { generateClient } from "aws-amplify/api";
import { useState } from "react";
import * as queries from "@/services/graphql/queries";
import { client } from "@/lib/client";

export default function Dashboard(){
    const [isLoading, setIsLoading] = useState(false);

    const fetchResponseCounts = async () => {
        setIsLoading(true);
        try {
            const result = await client.graphql({
                query: queries.getResponseCounts,
            });
    
            if ("data" in result && result.data && result.data.getResponseCounts) {
                const responseCounts = result.data.getResponseCounts;
                console.log("Response counts obtenidos:", responseCounts);
            } else {
                console.error("Respuesta inesperada de la query:", result);
            }
        } catch (error) {
            console.error("Error al obtener response counts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    
    return(
        <div className="p-10">
            <button onClick={() => fetchResponseCounts()}>Prueba</button>
            <h1>Dashboard</h1>
        </div>
    );
}