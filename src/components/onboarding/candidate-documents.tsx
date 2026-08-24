"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { 
  FileText, 
  Download, 
  Upload, 
  CheckCircle, 
  XCircle,
  Eye,
  Trash2
} from "lucide-react";

interface CandidateDocumentsProps {
  candidateId: string;
  documents: {
    cv: { 
      uploaded: boolean; 
      verified: boolean; 
      uploadedAt?: string | null;
      fileName?: string | null;
      fileSize?: string | null;
      verifiedAt?: string | null;
      verifiedBy?: string | null;
    };
    idCopy: { 
      uploaded: boolean; 
      verified: boolean; 
      uploadedAt?: string | null;
      fileName?: string | null;
      fileSize?: string | null;
      verifiedAt?: string | null;
      verifiedBy?: string | null;
    };
    certificates: { 
      uploaded: boolean; 
      verified: boolean; 
      uploadedAt?: string | null;
      fileName?: string | null;
      fileSize?: string | null;
      verifiedAt?: string | null;
      verifiedBy?: string | null;
    };
    recommendation: { 
      uploaded: boolean; 
      verified: boolean; 
      uploadedAt?: string | null;
      fileName?: string | null;
      fileSize?: string | null;
      verifiedAt?: string | null;
      verifiedBy?: string | null;
    };
  };
}

export function CandidateDocuments({ candidateId, documents }: CandidateDocumentsProps) {
  const documentTypes = [
    { key: "cv", label: "Curriculum Vitae (CV)", required: true },
    { key: "idCopy", label: "National ID Copy", required: true },
    { key: "certificates", label: "Academic Certificates", required: false },
    { key: "recommendation", label: "Recommendation Letter", required: false },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentTypes.map((docType) => {
              const doc = documents[docType.key as keyof typeof documents];
              
              return (
                <div key={docType.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{docType.label}</h4>
                      {docType.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    
                    {doc.uploaded ? (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {doc.fileName} ({doc.fileSize})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {doc.uploadedAt ? formatDate(doc.uploadedAt, "MMM dd, yyyy HH:mm") : "Unknown"}
                        </p>
                        {doc.verified && doc.verifiedAt && (
                          <p className="text-xs text-green-600">
                            Verified by {doc.verifiedBy} on {formatDate(doc.verifiedAt, "MMM dd, yyyy")}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not uploaded</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.uploaded ? (
                      <>
                        <Badge variant={doc.verified ? "success" : "warning"}>
                          {doc.verified ? "Verified" : "Pending Review"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {!doc.verified && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}