import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatFileSize } from "@/lib/utils";
import { 
  FileText, 
  Download, 
  Eye, 
  Upload,
  File,
  Image,
  FileCheck,
  AlertTriangle
} from "lucide-react";

interface AgentDocumentsProps {
  agentId: string;
}

// Mock documents data - replace with API call
const mockDocuments = [
  {
    id: "1",
    name: "National ID Copy",
    type: "IDENTIFICATION",
    fileName: "national_id_john_kamau.pdf",
    fileSize: 245760,
    uploadedDate: "2024-12-01T10:00:00Z",
    uploadedBy: "Jane Doe",
    status: "APPROVED",
    required: true,
  },
  {
    id: "2", 
    name: "KRA PIN Certificate",
    type: "IDENTIFICATION",
    fileName: "kra_pin_certificate.pdf",
    fileSize: 180240,
    uploadedDate: "2024-12-01T10:05:00Z",
    uploadedBy: "Jane Doe",
    status: "APPROVED",
    required: true,
  },
  {
    id: "3",
    name: "Academic Certificates", 
    type: "EDUCATION",
    fileName: "academic_certificates.pdf",
    fileSize: 1024000,
    uploadedDate: "2024-12-01T10:10:00Z",
    uploadedBy: "Jane Doe", 
    status: "APPROVED",
    required: true,
  },
  {
    id: "4",
    name: "Employment Contract",
    type: "EMPLOYMENT", 
    fileName: "employment_contract_signed.pdf",
    fileSize: 512000,
    uploadedDate: "2024-12-01T14:00:00Z",
    uploadedBy: "HR Department",
    status: "APPROVED",
    required: true,
  },
  {
    id: "5",
    name: "Medical Certificate",
    type: "MEDICAL",
    fileName: "medical_certificate.pdf", 
    fileSize: 320000,
    uploadedDate: "2024-12-02T09:00:00Z",
    uploadedBy: "Jane Doe",
    status: "PENDING_REVIEW",
    required: true,
  },
  {
    id: "6",
    name: "Bank Account Details",
    type: "FINANCIAL",
    fileName: "bank_account_details.pdf",
    fileSize: 128000,
    uploadedDate: "2024-12-01T11:00:00Z", 
    uploadedBy: "Jane Doe",
    status: "APPROVED",
    required: true,
  },
  {
    id: "7",
    name: "Training Certificates",
    type: "TRAINING",
    fileName: "training_certificates_2024.pdf",
    fileSize: 896000,
    uploadedDate: "2024-08-15T16:00:00Z",
    uploadedBy: "Training Department", 
    status: "APPROVED",
    required: false,
  },
];

// Required documents checklist
const requiredDocuments = [
  "National ID Copy",
  "KRA PIN Certificate", 
  "Academic Certificates",
  "Employment Contract",
  "Medical Certificate",
  "Bank Account Details",
];

export function AgentDocuments({ agentId }: AgentDocumentsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">Approved</Badge>;
      case "PENDING_REVIEW":
        return <Badge variant="warning">Pending Review</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "MISSING":
        return <Badge variant="outline">Missing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-5 w-5 text-green-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const approvedDocs = mockDocuments.filter(doc => doc.status === "APPROVED" && doc.required);
  const completionPercentage = Math.round((approvedDocs.length / requiredDocuments.length) * 100);

  return (
    <div className="space-y-6">
      {/* Document Compliance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Document Compliance
            </span>
            <span className="text-2xl font-bold">{completionPercentage}%</span>
          </CardTitle>
          <CardDescription>
            Required documents completion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{approvedDocs.length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {mockDocuments.filter(d => d.status === "PENDING_REVIEW" && d.required).length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {mockDocuments.filter(d => d.status === "REJECTED" && d.required).length}
                </p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {requiredDocuments.length - mockDocuments.filter(d => d.required).length}
                </p>
                <p className="text-sm text-muted-foreground">Missing</p>
              </div>
            </div>

            {completionPercentage < 100 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  {requiredDocuments.length - approvedDocs.length} required documents still needed
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Required Documents</span>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </CardTitle>
            <CardDescription>
              Mandatory documents for agent onboarding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDocuments
                .filter(doc => doc.required)
                .map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.fileName)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(doc.fileSize)} • Uploaded {formatDate(doc.uploadedDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Documents</CardTitle>
            <CardDescription>
              Supplementary and training-related documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDocuments
                .filter(doc => !doc.required)
                .map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.fileName)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(doc.fileSize)} • Uploaded {formatDate(doc.uploadedDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              
              {mockDocuments.filter(doc => !doc.required).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No additional documents uploaded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document History */}
      <Card>
        <CardHeader>
          <CardTitle>Document History</CardTitle>
          <CardDescription>
            Complete history of document uploads and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDocuments
              .sort((a, b) => new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime())
              .map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getFileIcon(doc.fileName)}
                    <div className="space-y-1">
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.fileName} • {formatFileSize(doc.fileSize)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadedDate, "dd MMM yyyy HH:mm")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{doc.type}</Badge>
                    {getStatusBadge(doc.status)}
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}