import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodObject } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash, Search, RefreshCw } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title: string;
  schema: ZodObject<any>;
  onAdd: (data: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onRefresh?: () => void;
}

interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey: keyof T | ((row: T) => any);
  cell?: (info: { row: T }) => React.ReactNode;
}

enum DialogMode {
  None,
  Add,
  Edit,
  Delete
}

export function DataTable<T extends { id: number }>({ 
  data, 
  columns, 
  title,
  schema,
  onAdd,
  onUpdate,
  onDelete,
  onRefresh
}: DataTableProps<T>) {
  const [dialogMode, setDialogMode] = useState<DialogMode>(DialogMode.None);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const handleOpenDialog = (mode: DialogMode, item?: T) => {
    setDialogMode(mode);
    setSelectedItem(item || null);
    
    if (mode === DialogMode.Edit && item) {
      // Convert item to form values
      const formValues: any = {};
      // Filter out only the properties that exist in the schema
      Object.keys(item).forEach(key => {
        // Skip id or other special properties that shouldn't be edited
        if (key !== 'id' && typeof (item as any)[key] !== 'undefined') {
          formValues[key] = (item as any)[key];
        }
      });
      form.reset(formValues);
    } else if (mode === DialogMode.Add) {
      form.reset({});
    }
  };

  const handleCloseDialog = () => {
    setDialogMode(DialogMode.None);
    setSelectedItem(null);
    form.reset();
  };

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    try {
      if (dialogMode === DialogMode.Add) {
        await onAdd(values);
        toast({
          title: "Success",
          description: `${title} added successfully`,
        });
      } else if (dialogMode === DialogMode.Edit && selectedItem) {
        await onUpdate(selectedItem.id, values);
        toast({
          title: "Success",
          description: `${title} updated successfully`,
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${dialogMode === DialogMode.Add ? 'add' : 'update'} ${title.toLowerCase()}`,
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    
    try {
      await onDelete(selectedItem.id);
      toast({
        title: "Success",
        description: `${title} deleted successfully`,
      });
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${title.toLowerCase()}`,
        variant: "destructive",
      });
    }
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    
    // Search through all fields
    return Object.values(item).some(value => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[200px]"
            />
          </div>
          {onRefresh && (
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={() => handleOpenDialog(DialogMode.Add)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell 
                        ? column.cell({ row }) 
                        : typeof column.accessorKey === 'function'
                          ? column.accessorKey(row)
                          : (row[column.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenDialog(DialogMode.Edit, row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDialog(DialogMode.Delete, row)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogMode === DialogMode.Add || dialogMode === DialogMode.Edit} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === DialogMode.Add ? `Add New ${title}` : `Edit ${title}`}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
              {/* Dynamically generate form fields based on schema */}
              {Object.keys(schema.shape).map(key => {
                if (key === 'id') return null; // Skip id field
                
                // Basic field type detection
                const fieldDef = schema.shape[key];
                const isEnum = fieldDef && fieldDef._def && fieldDef._def.typeName === 'ZodEnum';
                const isNumber = fieldDef && fieldDef._def && fieldDef._def.typeName === 'ZodNumber';
                
                // Get enum values if applicable
                const enumValues = isEnum && fieldDef._def.values ? fieldDef._def.values : [];
                
                return (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</FormLabel>
                        <FormControl>
                          {isEnum ? (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${key}`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {enumValues.map((value: string) => (
                                  <SelectItem key={value} value={value}>
                                    {value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              {...field}
                              type={isNumber ? "number" : "text"}
                              onChange={e => {
                                if (isNumber) {
                                  field.onChange(e.target.value === '' ? '' : Number(e.target.value));
                                } else {
                                  field.onChange(e.target.value);
                                }
                              }}
                            />
                          )}
                        </FormControl>
                      </FormItem>
                    )}
                  />
                );
              })}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {dialogMode === DialogMode.Add ? 'Add' : 'Update'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogMode === DialogMode.Delete} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}